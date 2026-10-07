import samples from './samples.json';
import cameras from './cameras.json';
export const sitePages = ['/', '/methodology/', '/privacy/', ...cameras.map(camera => `/${samples.find(sample => sample.id === camera.sampleId)!.slug}-raw-vs-jpeg/`)];
