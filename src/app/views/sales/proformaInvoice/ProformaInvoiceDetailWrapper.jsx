import React from "react";
import ProformaInvoiceDetail from "./ProformaInvoiceDetail";
import { useParams } from "react-router-dom";

const ProformaInvoiceDetailWrapper = () => {
  const { id } = useParams();
  return <ProformaInvoiceDetail id={id} />;
};

export default ProformaInvoiceDetailWrapper;
