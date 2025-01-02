import os
import sys
from typing import List, Tuple, Optional, Callable
from abc import ABC, abstractmethod
import numpy as np

from caffe import layers as L
from caffe import params as P
from caffe.proto import caffe_pb2
from caffe.net import Net
from caffe.util import format_int, ReadProtoFromTextFile, WriteProtoToTextFile, ReadProtoFromBinaryFile, WriteProtoToBinaryFile

class SolverAction:
    NONE = 0
    STOP = 1
    SNAPSHOT = 2

class Solver(ABC):
    def __init__(self, param):
        self.net = None
        self.test_nets = []
        self.param = param
        self.iter = 0
        self.current_step = 0
        self.callbacks = []
        self.requested_early_exit = False
        self.action_request_function = None
        self.losses = []
        self.smoothed_loss = 0

    def set_action_function(self, func: Callable[[], SolverAction]):
        self.action_request_function = func

    def get_requested_action(self) -> SolverAction:
        if self.action_request_function:
            return self.action_request_function()
        return SolverAction.NONE

    @abstractmethod
    def step(self, iters: int):
        pass

    def solve(self, resume_file: Optional[str] = None):
        if resume_file:
            self.restore(resume_file)

        start_iter = self.iter
        self.step(self.param.max_iter - self.iter)

        if self.param.snapshot_after_train and (not self.param.snapshot or self.iter % self.param.snapshot != 0):
            self.snapshot()

        if self.requested_early_exit:
            print("Optimization stopped early.")
            return

        if self.param.display and self.iter % self.param.display == 0:
            loss = self.net.forward()
            self.update_smoothed_loss(loss, start_iter, self.param.average_loss)
            print(f"Iteration {self.iter}, loss = {self.smoothed_loss}")

        if self.param.test_interval and self.iter % self.param.test_interval == 0:
            self.test_all()

        print("Optimization Done.")

    def snapshot(self):
        model_filename = self.snapshot_to_protobuf()
        self.snapshot_solver_state(model_filename)

    def snapshot_to_protobuf(self) -> str:
        model_filename = self.snapshot_filename(".caffemodel")
        print(f"Snapshotting to binary proto file {model_filename}")
        net_param = self.net.to_proto()
        WriteProtoToBinaryFile(net_param, model_filename)
        return model_filename

    def snapshot_solver_state(self, model_filename: str):
        state = caffe_pb2.SolverState()
        state.iter = self.iter
        state.learned_net = model_filename
        state_filename = self.snapshot_filename(".solverstate")
        print(f"Snapshotting solver state to {state_filename}")
        WriteProtoToBinaryFile(state, state_filename)

    def restore(self, state_file: str):
        print(f"Restoring previous solver status from {state_file}")
        state = caffe_pb2.SolverState()
        if state_file.endswith('.solverstate'):
            ReadProtoFromBinaryFile(state, state_file)
        else:
            ReadProtoFromTextFile(state_file, state)
        self.iter = state.iter
        if state.HasField('learned_net'):
            self.net.copy_from(state.learned_net)
        for state_blobs in state.history:
            self.history.append(state_blobs)

    def snapshot_filename(self, extension: str) -> str:
        return f"{self.param.snapshot_prefix}_iter_{format_int(self.iter)}{extension}"

    def test_all(self):
        for test_net_id in range(len(self.test_nets)):
            if self.requested_early_exit:
                break
            self.test(test_net_id)

    def test(self, test_net_id: int):
        print(f"Iteration {self.iter}, Testing net (#{test_net_id})")
        test_net = self.test_nets[test_net_id]
        accuracy = []
        for _ in range(self.param.test_iter[test_net_id]):
            result = test_net.forward()
            accuracy.append(result)
        print(f"Test accuracy: {np.mean(accuracy)}")

    def update_smoothed_loss(self, loss: float, start_iter: int, average_loss: int):
        if len(self.losses) < average_loss:
            self.losses.append(loss)
            n = len(self.losses)
            self.smoothed_loss = (self.smoothed_loss * (n - 1) + loss) / n
        else:
            idx = (self.iter - start_iter) % average_loss
            self.smoothed_loss += (loss - self.losses[idx]) / average_loss
            self.losses[idx] = loss

# Additional utility functions and classes would be implemented here