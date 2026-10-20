/* Figures transcribed from MELOOLOO – Financial Strategy (Mery) (1).pptx.
   Amounts are Rp billion unless a field explicitly says Rp million, kg, or %. */
window.MELOOLOO_FINANCE = {
  years: ['Y0','Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Y9','Y10'],
  revenue: [3.5,7.4,13.2,19.1,25.4,32.3,40.3,48.1,58.3,73.0,86.6],
  netIncome: [-1.3,0.1,2.0,3.8,5.3,6.4,6.5,9.0,11.9,14.9,19.6],
  cumulativeFcf: [-8.8,-8.6,-9.8,-8.5,-6.0,-1.5,2.0,9.1,17.0,26.1,43.3],
  balance: {
    years: ['Y0','Y2','Y4','Y6','Y8','Y10'],
    assets: [9.4,14.2,24.5,36.0,53.5,81.6],
    liabilities: [0.3,2.9,6.8,9.3,12.1,16.1],
    equity: [9.1,11.3,17.7,26.7,41.3,65.5]
  },
  breakEven: {
    years: ['Y1','Y2','Y3','Y4','Y5'],
    thresholdKg: [97251,114044,140040,172935,215986],
    productionKg: [100548,162313,223360,284407,345454],
    safetyMargin: ['3,3%','29,7%','37,3%','39,2%','37,5%']
  },
  spending: {
    years: ['Y0','Y1','Y2','Y3','Y4','Y5','Y6–Y10'],
    capexMillion: [7503,53,3368,3365,4069,3670,31569],
    opexMillion: [3137,3808,5202,6774,8567,11296,102827]
  },
  scenarios: [
    {name:'Pesimis',weight:'25%',npv:-19.9},
    {name:'Most likely',weight:'55%',npv:23.5},
    {name:'Optimis',weight:'20%',npv:53.5},
    {name:'Expected NPV',weight:'bobot 25/55/20',npv:18.7}
  ]
};
