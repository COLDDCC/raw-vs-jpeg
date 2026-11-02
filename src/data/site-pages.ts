import samples from './samples.json';
import cameras from './cameras.json';
export const sitePages = ['/', '/pt-br/', '/fr/', '/methodology/', '/privacy/', '/about/', '/cameras/', '/memory-card-calculator/', '/raw-file-size/', '/compressed-vs-uncompressed-raw/', '/raw-plus-jpeg/', ...cameras.map(camera => `/${samples.find(sample => sample.id === camera.sampleId)!.slug}-raw-vs-jpeg/`)];