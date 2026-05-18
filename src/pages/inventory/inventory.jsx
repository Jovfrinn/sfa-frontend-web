import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import InventoryBe from "../../components/inventory/InventoryBe";
import FitureInventory from "../../components/inventory/FitureInventory";

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [filterSatuan, setFilterSatuan] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterSelected, setFilterSelected] = useState({
    selectedCategory: null,
    selectedBrand: null,
  });
  

  // Callback function untuk trigger refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Master - Inventory" />

        <FitureInventory
          search={search}
          setSearch={setSearch}
          selectedBrand={(option) =>
            setFilterSelected({
              ...filterSelected,
              selectedBrand: option,
            })
          }
          selectedCategory={(option) =>
            setFilterSelected({
              ...filterSelected,
              selectedCategory: option,
            })
          }
          filterSatuan={filterSatuan}
          setFilterSatuan={setFilterSatuan}
          refresh={handleRefresh}
        />

        <InventoryBe
          search={search}
          selectedBrand={filterSelected.selectedBrand?.value}
          selectedCategory = {filterSelected.selectedCategory?.value}
          filterSatuan={filterSatuan?.value}
          refreshTrigger={refreshTrigger}
        />
      </MasterLayout>
    </>
  );
};

export default Inventory;
