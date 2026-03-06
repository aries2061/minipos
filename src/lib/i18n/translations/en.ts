const en = {
  // App
  'app.name': 'MiniPOS',

  // Nav
  'nav.dashboard': 'Dashboard',
  'nav.inventory': 'Inventory',
  'nav.sales': 'Sales',
  'nav.customers': 'Customers',
  'nav.analytics': 'Analytics',
  'nav.debts': 'Debts',

  // Auth
  'auth.signIn': 'Sign In',
  'auth.signOut': 'Sign Out',

  // Search
  'search.placeholder': 'Search... ⌘K',
  'search.commandPlaceholder': 'Search items, debtors, pages...',
  'search.noResults': 'No results found',
  'search.type.item': 'item',
  'search.type.debtor': 'debtor',
  'search.type.page': 'page',

  // Dashboard
  'dashboard.title': 'Dashboard',
  'dashboard.totalItems': 'Total Items',
  'dashboard.todaySales': "Today's Sales",
  'dashboard.todayRevenue': "Today's Revenue",
  'dashboard.todayProfit': "Today's Profit",
  'dashboard.lowStockItems': 'Low Stock Items',
  'dashboard.outstandingDebt': 'Outstanding Debt',

  // Inventory
  'inventory.title': 'Inventory',
  'inventory.searchPlaceholder': 'Search items by name, category, or SKU...',
  'inventory.addItem': '+ Add Item',
  'inventory.editItem': 'Edit Item',
  'inventory.addNewItem': 'Add New Item',
  'inventory.emptyMessage': 'No items found. Add your first item!',
  'inventory.itemName': 'Item Name *',
  'inventory.category': 'Category',
  'inventory.costPrice': 'Cost Price *',
  'inventory.salePrice': 'Sale Price *',
  'inventory.stockQuantity': 'Stock Quantity *',
  'inventory.skuBarcode': 'SKU / Barcode',
  'inventory.deleteConfirm': 'Delete this item?',

  // Table headers
  'table.name': 'Name',
  'table.category': 'Category',
  'table.cost': 'Cost',
  'table.salePrice': 'Sale Price',
  'table.stock': 'Stock',
  'table.sku': 'SKU',
  'table.actions': 'Actions',
  'table.phone': 'Phone',
  'table.date': 'Date',
  'table.items': 'Items',
  'table.total': 'Total',
  'table.payment': 'Payment',
  'table.debtor': 'Debtor',
  'table.status': 'Status',
  'table.noData': 'No data found.',

  // Common actions
  'action.edit': 'Edit',
  'action.delete': 'Delete',
  'action.cancel': 'Cancel',
  'action.create': 'Create',
  'action.update': 'Update',

  // Sales / POS
  'sales.title': 'Point of Sale',
  'sales.recentSales': 'Recent Sales',
  'sales.searchItems': 'Search items...',
  'sales.stock': 'Stock',
  'sales.cart': 'Cart',
  'sales.items': 'items',
  'sales.emptyCart': 'Click items to add to cart',
  'sales.each': 'each',
  'sales.total': 'Total',
  'sales.paymentMode': 'Payment Mode',
  'sales.cash': 'Cash',
  'sales.digital': 'Digital',
  'sales.debt': 'Debt',
  'sales.debtorName': 'Debtor Name *',
  'sales.enterDebtorName': 'Enter debtor name',
  'sales.debtorRequired': 'Please enter debtor name',
  'sales.success': 'Sale recorded successfully!',
  'sales.completeSale': 'Complete Sale',
  'sales.emptyMessage': 'No sales recorded yet.',
  'sales.paid': 'Paid',
  'sales.unpaid': 'Unpaid',
  'sales.completed': 'Completed',

  // Customers
  'customers.title': 'Customers',
  'customers.searchPlaceholder': 'Search customers by name or phone...',
  'customers.addCustomer': '+ Add Customer',
  'customers.editCustomer': 'Edit Customer',
  'customers.addNewCustomer': 'Add New Customer',
  'customers.emptyMessage': 'No customers found. Add your first customer!',
  'customers.name': 'Name *',
  'customers.phone': 'Phone Number',
  'customers.deleteConfirm': 'Delete this customer?',

  // Analytics
  'analytics.title': 'Analytics',
  'analytics.today': 'Today',
  'analytics.weekly': 'Weekly',
  'analytics.monthly': 'Monthly',
  'analytics.yearly': 'Yearly',
  'analytics.custom': 'Custom:',
  'analytics.to': 'to',
  'analytics.grossRevenue': 'Gross Revenue',
  'analytics.totalCost': 'Total Cost',
  'analytics.netProfit': 'Net Profit',
  'analytics.totalSales': 'Total Sales',
  'analytics.profitMargin': 'Profit Margin',
  'analytics.mostSoldItems': 'Most Sold Items',
  'analytics.sold': 'sold',
  'analytics.noSalesData': 'No sales data for this period',

  // Debts
  'debts.title': 'Debt Management',
  'debts.searchPlaceholder': 'Search debtors by name...',
  'debts.activeDebtors': 'Active Debtors:',
  'debts.totalOutstanding': 'Total Outstanding:',
  'debts.transactions': 'transactions',
  'debts.outstanding': 'Outstanding',
  'debts.hasDebt': 'Has Debt',
  'debts.settled': 'Settled',
  'debts.noDebtors': 'No debtors found.',
  'debts.markPaid': 'Mark Paid',
  'debts.markPaidConfirm': 'Mark this debt as paid?',
  'debts.paid': 'Paid',
} as const;

export type TranslationKey = keyof typeof en;
export default en;
