import {
  version,
} from './';

test('version is exported', () => {
  expect(typeof version).toBe('string');
  expect((/^\d+\.\d+/).test(version));
});
