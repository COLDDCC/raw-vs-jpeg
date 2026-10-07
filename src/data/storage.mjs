export function calculateStorage({rawMB,jpegMB,photos,format,cardGB,copies,drivePrice,driveTB,cloudPerTB}) {
 const values=[rawMB,jpegMB,photos,cardGB,copies,drivePrice,driveTB,cloudPerTB];
 if(!Number.isInteger(photos)||!Number.isInteger(copies)) throw new RangeError('Photograph and copy counts must be whole numbers.');
 if(values.some(v=>!Number.isFinite(v)||v<0)||cardGB===0||driveTB===0||copies<1||!['raw','jpeg','both'].includes(format)) throw new RangeError('Check your inputs. Use positive capacities and at least one copy.');
 const perPhoto=format==='both'?rawMB+jpegMB:format==='raw'?rawMB:jpegMB;
 const annualGB=perPhoto*photos/1000;
 return {perPhoto,annualGB,cards:Math.ceil(annualGB/cardGB),backupGB:annualGB*copies,driveCount:Math.ceil(annualGB*copies/(driveTB*1000)),driveCost:Math.ceil(annualGB*copies/(driveTB*1000))*drivePrice,cloudCost:annualGB/1000*cloudPerTB};
}
