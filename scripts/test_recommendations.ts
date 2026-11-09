import { getSimilarVideos, getSimilarTalks, computeVideoSimilarity } from '../src/lib/recommendations';
import { getHackerTubeRepository, getVideoByVid } from '../src/lib/hackertube';
import { performance } from 'perf_hooks';

console.log('Loading HackerTube catalog...');
const tLoad0 = performance.now();
const allVideos = getHackerTubeRepository();
const tLoad1 = performance.now();
console.log(`Loaded ${allVideos.length} videos in ${(tLoad1 - tLoad0).toFixed(2)} ms.`);

const testVids = [
  { vid: 'fNk_zzaMoSs', desc: 'Linear Algebra / 3Blue1Brown' },
  { vid: '4fFDFbi3toc', desc: 'Distributed Systems / Strange Loop' },
  { vid: 'FITJMJjASUs', desc: 'Functional Programming & Y Combinator / Confreaks' }
];

console.log('\n================================================================');
console.log('1. FUNCTIONAL VERIFICATION ON REQUIRED TEST VIDS');
console.log('================================================================');

for (const { vid, desc } of testVids) {
  const target = getVideoByVid(vid)!;
  const start = performance.now();
  const similar = getSimilarTalks(vid, 6);
  const duration = performance.now() - start;

  console.log(`\nTARGET: "${target.title}" (${desc})`);
  console.log(`VID: ${target.vid} | Channel: ${target.channel} | Topic: ${target.primary_topic} | HN Score: ${target.score}`);
  console.log(`Categories: ${target.categories.map((c) => c.name).join(', ')}`);
  console.log(`Tags: ${target.tags.join(', ')}`);
  console.log(`Query Latency: ${duration.toFixed(3)} ms`);
  console.log(`----------------------------------------------------------------`);
  console.log(`TOP 6 SIMILAR TALKS:`);

  similar.forEach((item, idx) => {
    const b = item.breakdown;
    console.log(`\n  ${idx + 1}. [Similarity Score: ${item.similarityScore.toFixed(3)} / 10.0] "${item.title}"`);
    console.log(`     VID: ${item.vid} | Channel: ${item.channel} | Topic: ${item.primary_topic} | HN Score: ${item.score}`);
    console.log(`     Signals breakdown:`);
    console.log(`       - Topic Match:      ${b.topicMatch.toFixed(2)}  (weight 3.0 -> ${b.topicWeighted.toFixed(2)} pts)`);
    console.log(`       - Category Overlap: ${b.categoryOverlap.toFixed(2)}  (weight 2.5 -> ${b.categoryWeighted.toFixed(2)} pts)`);
    console.log(`       - Tags Jaccard:     ${b.tagsJaccard.toFixed(2)}  (weight 2.0 -> ${b.tagsWeighted.toFixed(2)} pts)`);
    console.log(`       - Channel Match:    ${b.channelMatch.toFixed(1)}  (weight 1.5 -> ${b.channelWeighted.toFixed(2)} pts)`);
    console.log(`       - HN Score Boost:   ${b.hnScoreBoost.toFixed(3)} (weight 1.0 -> ${b.hnScoreBoost.toFixed(3)} pts)`);
    console.log(`     Categories: ${item.categories.map((c) => c.name).join(', ')}`);
    console.log(`     Tags: ${item.tags.join(', ')}`);
  });
}

console.log('\n================================================================');
console.log('2. BENCHMARKING PERFORMANCE & LATENCY');
console.log('================================================================');

// Warmup
for (let i = 0; i < 50; i++) {
  getSimilarTalks(allVideos[i % allVideos.length].vid, 6);
}

// Benchmark 1,000 queries
const ITERS = 1000;
const tBench0 = performance.now();
for (let i = 0; i < ITERS; i++) {
  const vid = testVids[i % testVids.length].vid;
  getSimilarTalks(vid, 6);
}
const tBench1 = performance.now();
const totalBenchMs = tBench1 - tBench0;
const avgPerQuery = totalBenchMs / ITERS;

console.log(`\nBenchmark Results for ${ITERS} repeated queries:`);
console.log(`  Total time: ${totalBenchMs.toFixed(2)} ms`);
console.log(`  Average latency per recommendation: ${avgPerQuery.toFixed(3)} ms`);
console.log(`  Throughput: ${(1000 / avgPerQuery).toFixed(0)} requests/sec`);

// Benchmark exhaustive scan comparison
const tExhaust0 = performance.now();
for (let i = 0; i < 50; i++) {
  const vid = testVids[i % testVids.length].vid;
  getSimilarTalks(vid, { limit: 6, mode: 'exhaustive' });
}
const tExhaust1 = performance.now();
const avgExhaustive = (tExhaust1 - tExhaust0) / 50;
console.log(`\nExhaustive Linear Scan (evaluating all 6,454 videos each time):`);
console.log(`  Average latency: ${avgExhaustive.toFixed(3)} ms`);

// Exhaustive test across all 6,454 videos in catalog
console.log('\nStress testing entire 6,454 video catalog...');
const latencies: number[] = [];
let minCount = Infinity;

for (let i = 0; i < allVideos.length; i++) {
  const vid = allVideos[i].vid;
  const q0 = performance.now();
  const recs = getSimilarTalks(vid, 6);
  const q1 = performance.now();
  latencies.push(q1 - q0);
  if (recs.length < minCount) minCount = recs.length;
}

latencies.sort((a, b) => a - b);
const p50 = latencies[Math.floor(latencies.length * 0.50)];
const p90 = latencies[Math.floor(latencies.length * 0.90)];
const p95 = latencies[Math.floor(latencies.length * 0.95)];
const p99 = latencies[Math.floor(latencies.length * 0.99)];
const max = latencies[latencies.length - 1];
const sum = latencies.reduce((a, b) => a + b, 0);
const avgAll = sum / latencies.length;

console.log(`\nEntire Catalog Stress Test Results (N = ${allVideos.length}):`);
console.log(`  Min recommendations found: ${minCount} (all >= 6? ${minCount >= 6})`);
console.log(`  Average latency:           ${avgAll.toFixed(3)} ms`);
console.log(`  p50 (Median) latency:      ${p50.toFixed(3)} ms`);
console.log(`  p90 latency:               ${p90.toFixed(3)} ms`);
console.log(`  p95 latency:               ${p95.toFixed(3)} ms`);
console.log(`  p99 latency:               ${p99.toFixed(3)} ms`);
console.log(`  Max latency:               ${max.toFixed(3)} ms`);
console.log(`  Requirement (< 15 ms):     ${max < 15.0 ? 'PASSED (STRICT COMPLIANCE)' : 'FAILED'}`);
