import React, { useState } from 'react'

interface PurchaseMaster {
    refNumber: string;
    supplierId: number;
    refDate: Date;
    note: string;
}

interface PurchaseDetail {
    productId: number;
    qty: number;
    purchaseUnitPrice: number;
    saleUnitPrice: number;
}

const AddPurchasePage = () => {
    const [purchaseMaster, setPurchaseMaster] = useState<PurchaseMaster>();
    const [purchaseDetail, setPurchaseDetail] = useState<PurchaseDetail[]>();

  return (
    <div>AddPurchasePage</div>
  )
}

export default AddPurchasePage