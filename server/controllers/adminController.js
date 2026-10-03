import { storageService } from '../services/storageService.js';

export async function getDashboardData(req, res) {
  try {
    const stats = await storageService.getAdminStats();
    return res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin dashboard metrics.' });
  }
}
