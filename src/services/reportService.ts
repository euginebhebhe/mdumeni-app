// src/services/reportService.ts
// Generates and shares PDF season reports

import * as Print   from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface ReportData {
  farmerName:    string;
  phone:         string;
  province:      string;
  district:      string;
  farmSize:      number;
  region:        number;
  budget:        string;
  cropName:      string;
  plantingDate:  string;
  estimatedYield: number;
  totalCost:     number;
  grossRevenue:  number;
  netProfit:     number;
  sellPrice:     number;
  bestMarket:    string;
  generatedDate: string;
}

function buildReportHTML(data: ReportData): string {
  const roi = data.totalCost > 0
    ? ((data.netProfit / data.totalCost) * 100).toFixed(0)
    : '0';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #1a1a1a; padding: 40px; font-size: 13px; }
  .header { border-bottom: 3px solid #1A5C2A; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
  .logo { font-size: 28px; font-weight: 900; color: #1A5C2A; letter-spacing: -1px; }
  .logo span { color: #EF9F27; }
  .tagline { font-size: 11px; color: #607868; margin-top: 2px; }
  .doc-info { text-align: right; font-size: 11px; color: #607868; }
  .doc-title { font-size: 18px; font-weight: 700; color: #1A5C2A; margin-bottom: 20px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #607868; border-bottom: 1px solid #e5e9e5; padding-bottom: 6px; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
  .field { padding: 6px 0; border-bottom: 0.5px solid #f0f0f0; }
  .field-label { font-size: 10px; color: #607868; text-transform: uppercase; letter-spacing: 0.04em; }
  .field-value { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-top: 1px; }
  .finance-table { width: 100%; border-collapse: collapse; }
  .finance-table td { padding: 8px 12px; border-bottom: 0.5px solid #f0f0f0; }
  .finance-table td:last-child { text-align: right; font-weight: 600; }
  .finance-table .total-row td { font-weight: 700; font-size: 15px; border-top: 2px solid #1A5C2A; color: #1A5C2A; padding-top: 12px; }
  .finance-table .cost-row td:last-child { color: #A32D2D; }
  .highlight-box { background: #EAF3DE; border: 1px solid #97C459; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
  .highlight-title { font-size: 11px; color: #607868; text-transform: uppercase; letter-spacing: 0.04em; }
  .highlight-value { font-size: 32px; font-weight: 900; color: #1A5C2A; margin: 4px 0; }
  .highlight-sub { font-size: 12px; color: #3B6D11; }
  .highlight-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .metric { background: #f8f9f8; border-radius: 6px; padding: 12px; }
  .metric-label { font-size: 10px; color: #607868; text-transform: uppercase; }
  .metric-value { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-top: 3px; }
  .footer { margin-top: 40px; border-top: 1px solid #e5e9e5; padding-top: 16px; font-size: 10px; color: #999; display: flex; justify-content: space-between; }
  .disclaimer { font-size: 10px; color: #999; font-style: italic; margin-top: 12px; }
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="logo">MDU<span>MENI</span></div>
    <div class="tagline">Know your market. Know your profit. Before you plant.</div>
  </div>
  <div class="doc-info">
    <div><strong>Season Report</strong></div>
    <div>Generated: ${data.generatedDate}</div>
    <div>INTELLI-Farming · University of Zimbabwe</div>
  </div>
</div>

<div class="doc-title">Farm Season Report</div>

<!-- Farm Profile -->
<div class="section">
  <div class="section-title">Farm Profile</div>
  <div class="grid">
    <div class="field">
      <div class="field-label">Farmer</div>
      <div class="field-value">${data.farmerName || 'Not provided'}</div>
    </div>
    <div class="field">
      <div class="field-label">Phone</div>
      <div class="field-value">${data.phone || '—'}</div>
    </div>
    <div class="field">
      <div class="field-label">Province</div>
      <div class="field-value">${data.province || '—'}</div>
    </div>
    <div class="field">
      <div class="field-label">District</div>
      <div class="field-value">${data.district || '—'}</div>
    </div>
    <div class="field">
      <div class="field-label">Farm size</div>
      <div class="field-value">${data.farmSize} hectares</div>
    </div>
    <div class="field">
      <div class="field-label">Agro-ecological region</div>
      <div class="field-value">Region ${data.region}</div>
    </div>
    <div class="field">
      <div class="field-label">Input budget</div>
      <div class="field-value">${data.budget.charAt(0).toUpperCase() + data.budget.slice(1)} input</div>
    </div>
  </div>
</div>

<!-- Current Season -->
<div class="section">
  <div class="section-title">Current Season</div>
  <div class="grid">
    <div class="field">
      <div class="field-label">Crop</div>
      <div class="field-value">${data.cropName}</div>
    </div>
    <div class="field">
      <div class="field-label">Planting date</div>
      <div class="field-value">${data.plantingDate}</div>
    </div>
    <div class="field">
      <div class="field-label">Estimated yield</div>
      <div class="field-value">${data.estimatedYield.toLocaleString()} kg</div>
    </div>
    <div class="field">
      <div class="field-label">Best sell price today</div>
      <div class="field-value">$${data.sellPrice.toFixed(3)}/kg at ${data.bestMarket}</div>
    </div>
  </div>
</div>

<!-- Net Profit Highlight -->
<div class="highlight-box">
  <div class="highlight-title">Estimated net profit</div>
  <div class="highlight-value">$${data.netProfit.toFixed(0)}</div>
  <div class="highlight-sub">ROI ${roi}% · Based on today's live market prices</div>
</div>

<!-- Key metrics -->
<div class="highlight-grid" style="margin-bottom: 24px;">
  <div class="metric">
    <div class="metric-label">Total input cost</div>
    <div class="metric-value">$${data.totalCost.toFixed(0)}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Gross revenue</div>
    <div class="metric-value">$${data.grossRevenue.toFixed(0)}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Return on investment</div>
    <div class="metric-value">${roi}%</div>
  </div>
</div>

<!-- Financial breakdown -->
<div class="section">
  <div class="section-title">Financial Breakdown</div>
  <table class="finance-table">
    <tr class="cost-row">
      <td>Total input cost</td>
      <td>-$${data.totalCost.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Estimated yield</td>
      <td>${data.estimatedYield.toLocaleString()} kg</td>
    </tr>
    <tr>
      <td>Sell price (today's best)</td>
      <td>$${data.sellPrice.toFixed(3)}/kg</td>
    </tr>
    <tr>
      <td>Gross revenue</td>
      <td>+$${data.grossRevenue.toFixed(2)}</td>
    </tr>
    <tr class="total-row">
      <td>Net profit</td>
      <td>$${data.netProfit.toFixed(2)}</td>
    </tr>
  </table>
</div>

<p class="disclaimer">
  This report is generated by MDUMENI AI using live market prices and estimated yields based on your farm profile and agro-ecological region.
  Prices are sourced from GMB, Mbare Musika, and verified market reports. This document may be used for loan applications, NGO reporting, or farm planning purposes.
</p>

<div class="footer">
  <span>MDUMENI · INTELLI-Farming · University of Zimbabwe</span>
  <span>bhebheeugine@gmail.com · +263 78 461 7009</span>
</div>

</body>
</html>`;
}

export async function generateAndShareReport(data: ReportData): Promise<void> {
  try {
    const html = buildReportHTML(data);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save or share your season report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      throw new Error('Sharing not available on this device');
    }
  } catch (e: any) {
    throw new Error(e.message ?? 'Could not generate report');
  }
}