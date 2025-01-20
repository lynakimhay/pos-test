"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Search, Plus, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
// import { redirect } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddPurchaseItemDetailModal } from "./add-detail-item-modal";
import PageWrapper from "@/components/page-wrapper";
import { productsModel } from "@/models/api/ProductsModel";
import { SupplierModel } from "@/models/api/supplierModel";
import { Decimal } from "@prisma/client/runtime/library";
// import { StockInDetail } from "@prisma/client";
// import { StockInMaster } from "@/app/api/stockin/route";

interface PurchaseDetail {
  productId?: number;
  qty?: number;
  purchaseUnitPrice?: number;
  saleUnitPrice?: number;
  totalAmount?: number;
  supplierId?: number;
  expiryDate?: Date;
}

type Supplier = {
  id: number;
  supplierName: string;
};
export interface StockInDetail {
  id: number;
  quantity: number;
  purchaseUnitPrice: Decimal;
  saleUnitPrice: Decimal;
  expiryDate: Date | null;
  productId: number;
  productName: string;
}

export interface StockInMaster {
  id: number;
  supplierId: number;
  referenceNumber: string;
  stockInDate: Date;
  stockInDetails: StockInDetail[];
  supplierName: string;
}

export default function AddPurchasePage() {
  const router = useRouter();
  const params = useParams();
  const purchaseId = params?.id;

  console.log("Purchase ID:", purchaseId);

  // Ref Data
  const [suppliers, setSuppliers] = useState<Supplier| null>(null);
  const [products, setProducts] = useState<productsModel[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<productsModel | null>(
    null
  );

  // Form Master
  const [stockInId, setStockInId] = useState<number | null>(null);
  const [refDate, setRefDate] = useState<Date>(new Date());
  const [refNum, setRefNum] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("1");
  const [note, setNote] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [stockInDate, setStockInDate] = useState<Date>(new Date());
  const [stockInDetails, setStockInDetails] = useState<StockInDetail[]>([]);

  // Form Detail
  const [qty, setQty] = useState<number>(1);
  const [purchaseUnitPrice, setPurchaseUnitPrice] = useState<number>(1);
  const [saleUnitPrice, setSaleUnitPrice] = useState<number>(1);
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());
  const [stockIn, setStockIn] = useState<StockInMaster[]>([]);
  const [stockInDetail, setStockInDetail] = useState<StockInDetail[]>([]);

  // Detail
  const [purchaseDetail, setPurchaseDetail] = useState<PurchaseDetail[]>([]);

  // Add Purchase Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Purchase Details:", purchaseDetail);
  

  useEffect(() => {
    const fetchStockInData = async () => {
      try {
        if (!purchaseId) return;

        const stockInResponse = await fetch(`/api/stockin/${purchaseId}`, {
          credentials: "same-origin",
        });

        if (!stockInResponse.ok) {
          throw new Error("Failed to fetch stock-in data");
        }

        const stockInData = await stockInResponse.json();
        const fetchedStockIn = stockInData.data as StockInMaster;

        setStockIn([fetchedStockIn]);
        setReferenceNumber(fetchedStockIn.referenceNumber);
        setStockInDate(new Date(fetchedStockIn.stockInDate));
        setStockInDetails(fetchedStockIn.stockInDetails);
        setSuppliers ({
          id:fetchedStockIn.id,
          supplierName:fetchedStockIn.supplierName
        })

        console.log("Fetched Stock-In Data:", fetchedStockIn);

        // Fetch supplier data
        // const supplierResponse = await fetch(
        //   `/api/supplier/${fetchedStockIn.supplierId}`,
        //   { credentials: "same-origin" }
        // );

        // if (!supplierResponse.ok) {
        //   throw new Error("Failed to fetch supplier data");
        // }

        // const supplierData = await supplierResponse.json();
        // setSuppliers([supplierData.data as SupplierModel]);
      } catch (error) {
        console.error("Error fetching stock-in data:", error);
        alert("Failed to fetch stock-in data.");
      }
    };

    if (purchaseId) {
      fetchStockInData();
    }
  }, [purchaseId]);

  useEffect(() => {
    fetch(`/api/supplier`, { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        const supplier = data.data as Supplier;
        setSuppliers(supplier);
      });
    console.log("...suppliers", suppliers);

    fetch("/api/product", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        const products = data.data as productsModel[];
        setProducts(products);
      });
  }, []);

  // Fetch existing purchase data by ID
  useEffect(() => {
    if (purchaseId) {
      fetch(`/api/stockin/${purchaseId}`, { credentials: "same-origin" })
        .then((res) => res.json())
        .then((data) => {
          if (!data.data) {
            console.error("No data received:", data.message);
            return;
          }

          const purchase = data.data;
          console.log(purchase);
          // Populate state with fetched data
          setRefDate(new Date(purchase.stockInDate));
          setNote(purchase.note);
          setRefNum(purchase.referenceNumber);
          setSupplierId(purchase.supplierId.toString());
          setPurchaseDetail(
            purchase.stockInDetails.map((detail: any) => ({
              productId: detail.productId,
              qty: detail.quantity,
              purchaseUnitPrice: detail.purchaseUnitPrice,
              saleUnitPrice: detail.saleUnitPrice,
              totalAmount: detail.totalPrice,
              expiryDate: detail.expiryDate
                ? new Date(detail.expiryDate)
                : null,
            }))
          );
        })
        .catch((error) =>
          console.error("Error fetching purchase data:", error)
        );
    }
  }, [purchaseId]);

  console.log(purchaseId);
    const handleAddPurchaseDetail = () => {
    if (selectedProduct) {
      const newItem = {
        productId: selectedProduct.id,
        qty: qty,
        purchaseUnitPrice: purchaseUnitPrice,
        saleUnitPrice: saleUnitPrice,
        totalAmount: qty * purchaseUnitPrice, // Assuming you calculate the total amount
      };
      setPurchaseDetail((prev) => [...prev, newItem]);
      resetForm(); // Reset the form after adding
    } else {
      // If no product is selected, show an alert or some form of validation
      alert("Please select a product.");
    }
  };

  // const handleRemoveData = (index) => {
  //   setPurchaseDetail((prev) => prev.filter((_, i) => i !== index));
  // };

  const resetForm = () => {
    setSelectedProduct(null);
    setQty(1);
    setPurchaseUnitPrice(0);
    setSaleUnitPrice(0);
    setExpiryDate(new Date());
  };

  const totalQty = purchaseDetail.reduce(
    (sum, item) => sum + (item.qty || 0),
    0
  );
  const totalAmount = purchaseDetail.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );
  const handleSaveMaster = () => {
    // Validate required fields
    if (!refNum.trim()) {
      alert("Please enter an invoice reference.");
      return;
    }

    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (purchaseDetail.length === 0) {
      alert("Please add at least one purchase detail.");
      return;
    }

    // Prepare purchase data
    const purchaseData = {
      supplierId: parseInt(supplierId),
      referenceNumber: refNum,
      stockInDate: refDate.toISOString(),
      stockInDetails: purchaseDetail.map((item) => ({
        productId: item.productId,
        quantity: item.qty,
        purchaseUnitPrice: item.purchaseUnitPrice,
        saleUnitPrice: item.saleUnitPrice,
        totalPrice: item.totalAmount,
        expiryDate: item.expiryDate,
      })),
    };

    // Send data to the API using PUT
    fetch(`/api/stockin/${purchaseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          alert("Purchase update successful!");
          setPurchaseDetail([]);
          setRefNum("");
          setNote("");
          setRefDate(new Date());
          console.log(result.data);
          router.push("/stockin");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      })
      .catch((error) => {
        console.error("Error in purchase update:", error);
        alert("Purchase update failed");
      });
  };
  console.log(purchaseDetail);

  const handleFullDelete = () => {
    if (!purchaseId) {
      alert("No purchase to delete.");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this purchase?"
    );
    if (!confirmDelete) return;

    fetch(`/api/stockin/${purchaseId}`, {
      method: "DELETE",
    })
      .then(async (response) => {
        if (response.ok) {
          alert("Purchase deleted successfully!");
          router.push("/stockin"); // Redirect to the stock-in list
        } else {
          const errorData = await response.json();
          alert("Purchase not deleted. Error: " + errorData.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting purchase:", error);
        alert("Failed to delete the purchase.");
      });
  };
  const handleRemoveData = () => {
    setPurchaseDetail([]);
    console.log("Data removed");
    router.push("/stockin");
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-4">Purchase Item Master</h1>
      <Card className="w-full bg-sidebar">
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {refDate ? format(refDate, "dd/MMM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={refDate}
                      onSelect={(refDate) => refDate && setRefDate(refDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>

                  <Input
                    // key={suppliers.supplierName}
                    value={suppliers?.supplierName}
                  />
               
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Invoice Reference</Label>
                <Input
                  type="text"
                  className="bg-white"
                  placeholder="Enter invoice reference"
                  onChange={(e) => setRefNum(e.target.value)}
                  value={refNum}
                />
              </div>
            </div>

            {/* Item Selection Section */}
            <div className="grid grid-cols-12 gap-4 items-end">
        <div className="col-span-4 space-y-2">
          <Label>Item Selection</Label>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsModalOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            {selectedProduct ? selectedProduct.nameEn : "Search and select item..."}
          </Button>
        </div>
        <div className="col-span-1 space-y-2">
          <Label>Qty</Label>
          <Input
            type="number"
            className="bg-white"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="col-span-1 space-y-2">
          <Label>P-Unit Price</Label>
          <Input
            type="number"
            className="bg-white"
            value={purchaseUnitPrice}
            onChange={(e) => setPurchaseUnitPrice(Number(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>
        <div className="col-span-1 space-y-2">
          <Label>S-Unit Price</Label>
          <Input
            className="bg-white"
            type="number"
            value={saleUnitPrice}
            onChange={(e) => setSaleUnitPrice(Number(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Expiry Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "dd/MMM/yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={(date) => date && setExpiryDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="col-span-2 flex gap-2">
          <Button className="flex-1" onClick={handleAddPurchaseDetail}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
          <Button variant="destructive" onClick={handleRemoveData}>
          <X className="w-4 h-4" />
          Remove 
        </Button>
        </div>
      </div>

      {/* Items Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Code</TableHead>
              <TableHead>Item Name EN</TableHead>
              <TableHead>Item Name KH</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseDetail.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {products.find((product) => product.id === item.productId)?.productCode}
                </TableCell>
                <TableCell>
                  {products.find((product) => product.id === item.productId)?.nameEn}
                </TableCell>
                <TableCell>
                  {products.find((product) => product.id === item.productId)?.nameKh}
                </TableCell>
                <TableCell className="text-right">{item.qty}</TableCell>
                <TableCell className="text-right">{item.purchaseUnitPrice}</TableCell>
                <TableCell className="text-right">{item.totalAmount}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

            {/* Footer Section */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveMaster}
                  className=" bg-blue-500 hover:bg-black  and text-white"
                >
                  Save
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => router.back()}
                >
                  Cancle
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleFullDelete}
                >
                  Delete
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Total Qty:</Label>
                  <Input className="w-20" value={totalQty} readOnly />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Discount:</Label>
                  <Input className="w-20" defaultValue="0" />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Total Amt:</Label>
                  <Input className="w-32" value={`$${totalAmount}`} readOnly />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <AddPurchaseItemDetailModal
          products={products}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onItemSelect={(item) => {
            setSelectedProduct(item);
            setIsModalOpen(false);
          }}
        />
      </Card>
    </PageWrapper>
  );
}
