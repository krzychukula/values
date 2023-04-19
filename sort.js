export async function oddEvenSort(arr, asyncCompare) {
  const n = arr.length;
  let sorted = false;
  while (!sorted) {
    sorted = true;

    console.info("Sort even-indexed elements");
    for (let i = 0; i < n - 1; i += 2) {
      const shouldSwap = await asyncCompare(arr[i], arr[i + 1]);
      if (shouldSwap > 0) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
      }
    }

    console.info("Sort odd-indexed elements");
    for (let i = 1; i < n - 1; i += 2) {
      const shouldSwap = await asyncCompare(arr[i], arr[i + 1]);
      if (shouldSwap > 0) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
      }
    }
  }

  return arr;
}

export function estimateOddEvenSortComparisons(n) {
  if (n < 2) return 0;
  return (n / 2) * (Math.log(n) + 0.577);
}
