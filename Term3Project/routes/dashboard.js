import express from 'express';
import { arrivals, metrics, origins, stayTrends } from '../data/dashboardData.js';

const router = express.Router();

function normalizeIsland(value = '') {
  return value
    .toLowerCase()
    .replaceAll("'", '')
    .replaceAll('`', '')
    .replaceAll('ʻ', '')
    .replaceAll('’', '')
    .replaceAll(' ', '');
}

function islandMatches(recordIsland, queryIsland) {
  if (!queryIsland) {
    return true;
  }

  return normalizeIsland(recordIsland) === normalizeIsland(queryIsland);
}

router.get('/arrivals', (req, res) => {
  const data = arrivals.filter((row) => islandMatches(row.island, req.query.island));
  res.json(data);
});

router.get('/origins', (req, res) => {
  const data = origins.find((row) => islandMatches(row.island, req.query.island));
  if (!data) {
    return res.status(404).json({ error: 'Island data not found' });
  }

  res.json(data);
});

router.get('/metrics', (req, res) => {
  const data = metrics.find((row) => islandMatches(row.island, req.query.island));
  if (!data) {
    return res.status(404).json({ error: 'Island data not found' });
  }

  res.json(data);
});

router.get('/stay-trends', (req, res) => {
  const data = stayTrends.filter((row) => islandMatches(row.island, req.query.island));
  res.json(data);
});

export default router;