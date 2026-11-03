// Camera-specific guidance tied to the three source records; no unmeasured mode is presented as tested.
export const cameraGuides={
6402:{
 heading:'EOS R6 Mark II: planning with this CR3 capture',
 paragraphs:[
 'This Canon file is identified in the source archive as a normal full-frame RAW capture. The recorded 29.40 MB is useful when planning space for photographs saved with that setting. It does not describe a C-RAW file, a cropped sensor capture, or Dual Pixel RAW. Those options should be evaluated with their own originals rather than applying an assumed percentage reduction to this figure.',
 'If you alternate between normal RAW and C-RAW, separate them when reviewing a recent import. A single mixed-folder average may hide the difference between recording modes. The most practical approach is to select several typical files from each mode, check their sizes in bytes, and use a representative value in the calculator. The calculation below deliberately uses only the original source file, so you can reproduce every number.',
 'The JPEG side of the visual comparison is the camera preview embedded inside that CR3. It is not an independently captured full-resolution JPEG. Compare its camera-rendered color and tone with the developed RAW, but do not infer that the slider measures detail recovery, a JPEG storage average or the camera’s maximum dynamic range.'
],
 recommendation:'For planned editing, start by testing normal RAW in the lighting you photograph most. If card space or buffer behavior is a constraint, compare your own C-RAW files and check your camera manual rather than assuming the measured normal RAW size applies.'
},
2414:{
 heading:'Sony A7 III: understand the compressed ARW example',
 paragraphs:[
 'The Sony sample is archived under the model identifier ILCE-7M3, the A7 III camera identifier. Its original ARW measures 25.64 MB and is labeled 14-bit compressed RAW. That source description is important: the number is not an uncompressed ARW benchmark, and it should not be used to calculate how much space an uncompressed workflow will require.',
 'If you choose different RAW recording options in the camera menu, compare a group of original files recorded in each option. Use the exact byte size rather than the rounded megabyte label and keep the camera setting with the record. Camera settings, scene complexity and the recording format can change the result. The source link and checksum allow this particular example to be checked independently.',
 'The embedded JPEG preview in this Sony example has a smaller pixel dimension than the decoded RAW export. The slider therefore lets you inspect rendering choices such as color and contrast, but it is not an apples-to-apples full-resolution sharpness comparison. For that question, a separately saved high-quality JPEG from the same exposure would be needed.'
],
 recommendation:'Use the measured compressed-RAW value for a first card-space estimate only if your own workflow uses a comparable mode. For other settings, manually enter the size from your own recent ARW files.'
},
898:{
 heading:'Nikon D750: what the lossless NEF sample proves',
 paragraphs:[
 'This Nikon original is labeled as a 14-bit lossless-compressed NEF capture, and the source file measures 26.34 MB. Lossless refers to its data compression, not to a claim that the file has the same storage footprint as every other D750 capture. A different bit-depth setting or compression option requires an independent measurement.',
 'The size-based table below models identical files at the observed byte count, so the numbers are easy to check. Actual photographs may occupy different space, even when the camera is unchanged. If you are estimating capacity for a trip or job, review multiple NEF files made at your usual settings and leave headroom for variations, card formatting and other files.',
 'The comparison preparation for this D750 file removes an eight-pixel border from each edge of the decoded sensor image to align with the camera preview framing. That is a documented processing adjustment, not invented scene content. The embedded preview and developed RAW may still differ because their processing paths differ. This is not a controlled test of highlight recovery or sensor performance.'
],
 recommendation:'When using 12-bit versus 14-bit NEF, or changing compression modes, base your storage estimates on separately recorded originals. Keep the documented 14-bit lossless sample as a reference, not a universal D750 average.'
}
};
