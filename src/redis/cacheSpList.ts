const { CMS_CACHE } = process.env;

const spList = [
    {
      "name": "G_Area",
      "expiry": "24h"
    },
    {
      "name": "G_District",
      "expiry": "24h"
    },
    {
      "name": "G_State",
      "expiry": "24h"
    },
    {
      "name": "G_AppVersion",
      "expiry": "4h"
    },
    {
      "name": "G_LuckyDraw",
      "expiry": "12h"
    },
    {
      "name": "G_Dashboard",
      "expiry": "24h"
    },
    {
      "name": "G_DashboardSkuWiseProductScan",
      "expiry": "24h"
    },
    {
      "name": "G_TopUserPointSummary",
      "expiry": "1h"
    }
]

if (CMS_CACHE) {
  spList.push({
    "name": "G_CMSByCMSType",
    "expiry" : "24h"
  })
}

export default spList