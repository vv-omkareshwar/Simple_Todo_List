import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock implementation of the Recommendations component
interface Recommendation {
  name: string;
  position: string;
  company: string;
  text: string;
}

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    // Simulating fetching recommendations from an API
    const fetchedRecommendations: Recommendation[] = [
      {
        name: "John Doe",
        position: "Senior Developer",
        company: "Tech Corp",
        text: "Omkar is an exceptional developer with a keen eye for detail."
      },
      {
        name: "Jane Smith",
        position: "Project Manager",
        company: "Innovative Solutions",
        text: "Working with Omkar was a pleasure. His problem-solving skills are outstanding."
      },
      {
        name: "Mike Johnson",
        position: "CTO",
        company: "StartUp Inc",
        text: "Omkar's ability to quickly adapt to new technologies is impressive."
      }
    ];

    setRecommendations(fetchedRecommendations);
  }, []);

  const nextRecommendation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <section id="recommendations">
      <h2 className="recommendations-title">Recommendations</h2>
      {recommendations.length > 0 && (
        <div className="recommendation-container">
          <button onClick={prevRecommendation} className="recommendation-nav prev">
            &lt;
          </button>
          <div className="recommendation-content">
            <p className="recommendation-text">"{recommendations[currentIndex].text}"</p>
            <p className="recommendation-author">
              - {recommendations[currentIndex].name}, {recommendations[currentIndex].position} at {recommendations[currentIndex].company}
            </p>
          </div>
          <button onClick={nextRecommendation} className="recommendation-nav next">
            &gt;
          </button>
        </div>
      )}
    </section>
  );
};

// Test suite
describe('Recommendations Component', () => {
  it('renders the component with initial recommendation', async () => {
    render(<Recommendations />);
    
    await waitFor(() => {
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText(/Omkar is an exceptional developer with a keen eye for detail./)).toBeInTheDocument();
      expect(screen.getByText(/John Doe, Senior Developer at Tech Corp/)).toBeInTheDocument();
    });
  });

  it('navigates to the next recommendation when clicking the next button', async () => {
    render(<Recommendations />);
    
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('>'));

    await waitFor(() => {
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Working with Omkar was a pleasure./)).toBeInTheDocument();
    });
  });

  it('navigates to the previous recommendation when clicking the prev button', async () => {
    render(<Recommendations />);
    
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('<'));

    await waitFor(() => {
      expect(screen.getByText(/Mike Johnson/)).toBeInTheDocument();
      expect(screen.getByText(/Omkar's ability to quickly adapt to new technologies is impressive./)).toBeInTheDocument();
    });
  });
});

// Mock implementations of testing libraries
const mockRender = (component: React.ReactElement) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  React.render(component, container);
};

const mockFireEvent = {
  click: (element: HTMLElement) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }
};

const mockScreen = {
  getByText: (text: string | RegExp) => {
    const elements = document.body.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (typeof text === 'string' && element.textContent === text) {
        return element;
      } else if (text instanceof RegExp && text.test(element.textContent || '')) {
        return element;
      }
    }
    throw new Error(`Unable to find an element with the text: ${text}`);
  }
};

const mockWaitFor = async (callback: () => void) => {
  await new Promise(resolve => setTimeout(resolve, 0));
  callback();
};

// Mock implementation of jest-dom
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

expect.extend({
  toBeInTheDocument(received) {
    const pass = received instanceof HTMLElement && document.body.contains(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in the document`,
        pass: false,
      };
    }
  },
});

// Test runner
function describe(name: string, fn: () => void) {
  console.log(`Test suite: ${name}`);
  fn();
}

function it(name: string, fn: () => void) {
  console.log(`  Test: ${name}`);
  fn();
}

// Run the tests
describe('Recommendations Component', () => {
  it('renders the component with initial recommendation', async () => {
    mockRender(<Recommendations />);
    
    await mockWaitFor(() => {
      expect(mockScreen.getByText('Recommendations')).toBeInTheDocument();
      expect(mockScreen.getByText(/Omkar is an exceptional developer with a keen eye for detail./)).toBeInTheDocument();
      expect(mockScreen.getByText(/John Doe, Senior Developer at Tech Corp/)).toBeInTheDocument();
    });
  });

  it('navigates to the next recommendation when clicking the next button', async () => {
    mockRender(<Recommendations />);
    
    await mockWaitFor(() => {
      expect(mockScreen.getByText(/John Doe/)).toBeInTheDocument();
    });

    mockFireEvent.click(mockScreen.getByText('>'));

    await mockWaitFor(() => {
      expect(mockScreen.getByText(/Jane Smith/)).toBeInTheDocument();
      expect(mockScreen.getByText(/Working with Omkar was a pleasure./)).toBeInTheDocument();
    });
  });

  it('navigates to the previous recommendation when clicking the prev button', async () => {
    mockRender(<Recommendations />);
    
    await mockWaitFor(() => {
      expect(mockScreen.getByText(/John Doe/)).toBeInTheDocument();
    });

    mockFireEvent.click(mockScreen.getByText('<'));

    await mockWaitFor(() => {
      expect(mockScreen.getByText(/Mike Johnson/)).toBeInTheDocument();
      expect(mockScreen.getByText(/Omkar's ability to quickly adapt to new technologies is impressive./)).toBeInTheDocument();
    });
  });
});

console.log('All tests completed.');