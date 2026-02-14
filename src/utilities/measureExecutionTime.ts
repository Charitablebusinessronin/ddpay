/**
 * Utility function to measure and log execution time of async functions
 * using the performance API.
 *
 * @param fn - The function to measure
 * @param label - Optional label for the log output
 * @returns The result of the function
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
  label = 'Operation',
): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const end = performance.now()
    console.log(`[${label}] Execution time: ${(end - start).toFixed(2)}ms`)
    return result
  } catch (error) {
    const end = performance.now()
    console.log(`[${label}] Execution time: ${(end - start).toFixed(2)}ms (failed)`)
    throw error
  }
}

/**
 * Synchronous version of measureExecutionTime for sync functions
 *
 * @param fn - The function to measure
 * @param label - Optional label for the log output
 * @returns The result of the function
 */
export function measureExecutionTimeSync<T>(fn: () => T, label = 'Operation'): T {
  const start = performance.now()
  try {
    const result = fn()
    const end = performance.now()
    console.log(`[${label}] Execution time: ${(end - start).toFixed(2)}ms`)
    return result
  } catch (error) {
    const end = performance.now()
    console.log(`[${label}] Execution time: ${(end - start).toFixed(2)}ms (failed)`)
    throw error
  }
}
