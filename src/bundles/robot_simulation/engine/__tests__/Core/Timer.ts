import { Timer } from '../../Core/Timer'; // Adjust the import path as per your project structure

describe('Timer', () => {
  let timer;
  let mockTimestamp;

  beforeEach(() => {
    timer = new Timer();
    mockTimestamp = 1000; // Initial mock timestamp in milliseconds
  });

  describe('pause method', () => {
    it('should not pause if the timer has not started', () => {
      timer.pause();
      expect(timer).toHaveProperty('_isRunning', false);
      expect(timer).toHaveProperty('_pausedAt', null);
    });

    it('should pause the running timer', () => {
      timer.step(mockTimestamp); // Start the timer
      timer.pause();
      expect(timer).toHaveProperty('_isRunning', false);
      expect(timer).toHaveProperty('_pausedAt', mockTimestamp);
    });
  });

  describe('step method', () => {
    it('should start the timer if not already started', () => {
      timer.step(mockTimestamp);
      expect(timer).toHaveProperty('_startTime', mockTimestamp);
    });

    it('should update the current time', () => {
      timer.step(mockTimestamp);
      expect(timer).toHaveProperty('_currentTime', mockTimestamp);
    });

    it('should accumulate paused time', () => {
      timer.step(mockTimestamp); // Start the timer
      timer.pause();
      const resumeTimestamp = 2000;
      timer.step(resumeTimestamp);
      expect(timer).toHaveProperty('_timeSpentPaused', resumeTimestamp - mockTimestamp);
    });

    it('should calculate the correct frame duration', () => {
      timer.step(mockTimestamp);
      const newTimestamp = 1500;
      timer.step(newTimestamp);
      expect(timer).toHaveProperty('_frameDuration', 500);
    });

    it('should resume the timer if it was paused', () => {
      timer.step(mockTimestamp);
      timer.pause();
      const resumeTimestamp = 2000;
      timer.step(resumeTimestamp);
      expect(timer).toHaveProperty('_isRunning', true);
    });

    it('should return correct FrameTimingInfo', () => {
      const frameTimingInfo = timer.step(mockTimestamp);
      expect(frameTimingInfo).toMatchObject({
        elapsedTimeReal: expect.any(Number),
        elapsedTimeSimulated: expect.any(Number),
        frameDuration: expect.any(Number),
        framesPerSecond: expect.any(Number),
      });
    });

    it('should correctly handle time after pause and resume', () => {
        const startTimestamp = 1000;
        const pauseTimestamp = 2000;
        const resumeTimestamp = 3000;
        const finalTimestamp = 4000;
  
        timer.step(startTimestamp); // Start the timer
        timer.pause();

        timer.step(pauseTimestamp); // Paused at 2000ms
        timer.step(resumeTimestamp); // Resumed at 3000ms
        const frameTimingInfo = timer.step(finalTimestamp); // Stepped at 4000ms
  
        // Total elapsed time should be 3000ms (4000 - 1000)
        // Time spent paused is 1000ms (3000 - 2000)
        // Therefore, elapsed simulated time should be 2000ms (3000 - 1000)
        expect(frameTimingInfo.elapsedTimeSimulated).toBe(2000);
        expect(frameTimingInfo.elapsedTimeReal).toBe(3000);
        expect(frameTimingInfo.frameDuration).toBe(1000); // Time since last step
        expect(frameTimingInfo.framesPerSecond).toBeCloseTo(1); // 1000ms frame duration
      });
  });
});
