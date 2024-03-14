// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import {
    columnsDataDevelopment,
    columnsDataCheck,
    columnsDataColumns,
    columnsDataComplex, messagesDataColumns,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React from "react";
import MessagesTable from "views/admin/dataTables/components/MessagesTable";

export default function Settings() {
  // Chakra Color Mode
  return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid
            mb='20px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>

          <ColumnsTable
              columnsData={columnsDataColumns}
          />
            <MessagesTable
                columnsData={messagesDataColumns}
            />
        </SimpleGrid>
      </Box>
  );
}
