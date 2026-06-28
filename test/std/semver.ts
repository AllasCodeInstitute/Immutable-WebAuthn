export const parse = (v: string) => Object.fromEntries(['major','minor','patch'].map((k,i)=>[k,Number(v.split('.')[i] ?? 0)]));
export const lessThan = (a: any, b: any) => a.major !== b.major ? a.major < b.major : a.minor !== b.minor ? a.minor < b.minor : a.patch < b.patch;
