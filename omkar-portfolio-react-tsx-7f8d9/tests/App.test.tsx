import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock components
jest.mock('./components/Header', () => () => <header data-testid="header">Header</header>);
jest.mock('./components/About', () => () => <section data-testid="about">About</section>);
jest.mock('./components/Skills', () => () => <section data-testid="skills">Skills</section>);
jest.mock('./components/Projects', () => () => <section data-testid="projects">Projects</section>);
jest.mock('./components/Recommendations', () => () => <section data-testid="recommendations">Recommendations</section>);
jest.mock('./components/Contact', () => () => <section data-testid="contact">Contact</section>);

// Mock CSS import
jest.mock('./styles/index.css', () => ({}));

// App component implementation
const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <About />
        <Skills />
        <Projects />
        <Recommendations />
        <Contact />
      </main>
    </div>
  );
};

// Test suite
describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<App />);
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('skills')).toBeInTheDocument();
    expect(screen.getByTestId('projects')).toBeInTheDocument();
    expect(screen.getByTestId('recommendations')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
  });

  it('renders sections in correct order', () => {
    render(<App />);
    const main = screen.getByRole('main');
    const sections = main.children;
    expect(sections[0]).toHaveAttribute('data-testid', 'about');
    expect(sections[1]).toHaveAttribute('data-testid', 'skills');
    expect(sections[2]).toHaveAttribute('data-testid', 'projects');
    expect(sections[3]).toHaveAttribute('data-testid', 'recommendations');
    expect(sections[4]).toHaveAttribute('data-testid', 'contact');
  });
});

// Test runner
const describe = (name: string, fn: () => void) => {
  console.log(`Test Suite: ${name}`);
  fn();
};

const it = (name: string, fn: () => void) => {
  console.log(`  Test: ${name}`);
  try {
    fn();
    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }
};

const expect = (actual: any) => ({
  toBeInTheDocument: () => {
    if (!actual) {
      throw new Error('Element not found in the document');
    }
  },
  toHaveAttribute: (attr: string, value: string) => {
    if (actual.getAttribute(attr) !== value) {
      throw new Error(`Expected element to have attribute ${attr}="${value}"`);
    }
  },
});

const screen = {
  getByTestId: (testId: string) => document.querySelector(`[data-testid="${testId}"]`),
  getByRole: (role: string) => document.querySelector(`[role="${role}"]`),
};

const render = (component: React.ReactElement) => {
  document.body.innerHTML = '';
  const div = document.createElement('div');
  div.innerHTML = React.createElement(component as any).props.children.map((child: any) => 
    child.type.mock.calls[0][0].children
  ).join('');
  document.body.appendChild(div);
};

// Run tests
describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<App />);
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('skills')).toBeInTheDocument();
    expect(screen.getByTestId('projects')).toBeInTheDocument();
    expect(screen.getByTestId('recommendations')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
  });

  it('renders sections in correct order', () => {
    render(<App />);
    const main = screen.getByRole('main');
    const sections = main.children;
    expect(sections[0]).toHaveAttribute('data-testid', 'about');
    expect(sections[1]).toHaveAttribute('data-testid', 'skills');
    expect(sections[2]).toHaveAttribute('data-testid', 'projects');
    expect(sections[3]).toHaveAttribute('data-testid', 'recommendations');
    expect(sections[4]).toHaveAttribute('data-testid', 'contact');
  });
});

console.log('All tests completed.');