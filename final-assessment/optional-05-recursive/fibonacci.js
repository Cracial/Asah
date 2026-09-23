function fibonacci(n) {

    if (n === 0) {
    return [0];
}
    if (n === 1) {
        return [0, 1];
}

  const prevSeq = fibonacci(n - 1);
  const nextValue = prevSeq[prevSeq.length - 1] + prevSeq[prevSeq.length - 2];
  
  return [...prevSeq, nextValue];
}

// Jangan hapus kode di bawah ini!
export default fibonacci;
