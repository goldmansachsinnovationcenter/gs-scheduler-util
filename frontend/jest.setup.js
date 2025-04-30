import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(),
  useParams: jest.fn(() => ({})),
}));

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api';

global.fetch = jest.fn();
