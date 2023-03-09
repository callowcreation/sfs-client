import { DynamicUserPipe } from './dynamic-user.pipe';

describe('DynamicUserPipe', () => {
  it('create an instance', () => {
    const pipe = new DynamicUserPipe();
    expect(pipe).toBeTruthy();
  });
});
