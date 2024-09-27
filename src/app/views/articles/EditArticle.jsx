import React, { useState, useEffect } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Button } from "../../shared/components/button/Button";
import { Input } from "../../shared/components/input/Input";
import { SelectInput } from "../../shared/components/select/SelectInput";
import { FileInput } from "../../shared/components/fileInput/FileInput";
import { TextArea } from "../../shared/components/textArea/TextArea";
import { Switch } from "../../shared/components/switch/Switch";
import groflexService from "../../services/groflex.service";
import config from "../../../../config";
import { useNavigate, useParams } from "react-router-dom";
import ArticleSearchComponent from "../../shared/components/articleSearch/ArticleSearchComponent";

const EditArticle = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  console.log(articleId, "articleId");
  const [editArticleFormData, setEditArticleFormData] = useState({
    articleNumber: "",
    hsnSacCode: "",
    articleName: "",
    articleDescription: "",
    articleImage: "",
    ean: "",
    sku: "",
    articleCategory: "",
    unit: "",
    gstRate: 0,
    mrp: "",
    netPurchasePrice: "",
    grossPurchasePrice: "",
    netSalesPrice: "",
    grossSalesPrice: "",
    notes: "",
    showNotes: false,
  });

  useEffect(() => {
    if (articleId) {
      groflexService
        .request(`${config.resourceUrls.article}${articleId}`, { auth: true })
        .then((res) => {
          console.log(res, "Article data from edit");
          if (!res.body.data) {
            navigate("/articles");
            return;
          }
          setEditArticleFormData({
            ...editArticleFormData,
            articleNumber: String(res.body.data.number),
            avgPurchaseValue: 0,
            calculationBase: "net",
            articleCategory: res.body.data.category,
            currentStock: null,
            articleDescription: res.body.data.description,
            ean: String(res.body.data.eanNo),
            hsnSacCode: String(res.body.data.hsnSacCode),
            images: [],
            isValidated: false,
            metaData: {
              imageUrl: null,
            },
            minimumBalance: null,
            mrp: res.body.data.mrp,
            showNotes: res.body.data.notesAlert,
            openingBalance: null,
            netSalesPrice: res.body.data.price,
            grossSalesPrice: res.body.data.priceGross,
            netPurchasePrice: res.body.data.purchasePrice,
            grossPurchasePrice: res.body.data.purchasePriceGross,
            articleName: res.body.data.title,
            trackedInInventory: false,
            unit: res.body.data.unit,
            value: 0,
            gstRate: res.body.data.vatPercent,
            notes: res.body.data.notes,
            sku: String(res.body.data.skuNo),
          });
        });
    }
  }, [articleId]);

  const handleEdit = () => {
    const payload = {
      avgPurchaseValue: 0,
      calculationBase: "net",
      category: editArticleFormData.articleCategory,
      currentStock: null,
      description: editArticleFormData.articleDescription,
      eanNo: editArticleFormData.ean.toString(),
      hsnSacCode: editArticleFormData.hsnSacCode.toString(),
      images: [],
      isValidated: false,
      metaData: {
        imageUrl: null,
      },
      minimumBalance: null,
      mrp: editArticleFormData.mrp,
      notesAlert: editArticleFormData.showNotes,
      number: editArticleFormData.articleNumber.toString(),
      openingBalance: null,
      price: editArticleFormData.netSalesPrice,
      priceGross: editArticleFormData.grossSalesPrice,
      purchasePrice: editArticleFormData.netPurchasePrice,
      purchasePriceGross: editArticleFormData.grossPurchasePrice,
      title: editArticleFormData.articleName,
      trackedInInventory: false,
      unit: editArticleFormData.unit,
      value: 0,
      vatPercent: editArticleFormData.gstRate,
      notes: editArticleFormData.notes,
      skuNo: String(editArticleFormData.sku),
    };
    groflexService
      .request(`${config.resourceUrls.article}${articleId}`, {
        auth: true,
        data: payload,
        method: "PUT",
      })
      .then((res) => {
        if (res.body.data) {
          navigate("/articles");
          groflexService.toast.success("Article edited succesfully");
          // console.log(res, "Article Edited Succcessfullys");
        } else {
          groflexService.toast.error("Failed to edit article");
          // console.log(res, "Article Edited failed");
        }
      });

    console.log(payload);
  };

  const handleArticleNumberChange = (e) => {
    const inputArticleNumber = parseInt(e.target.value);
    setEditArticleFormData({
      ...editArticleFormData,
      articleNumber: inputArticleNumber,
    });
  };

  const handleHsnSacCodeChange = (e) => {
    const inputHsnSacCode = parseInt(e.target.value);
    setEditArticleFormData({
      ...editArticleFormData,
      hsnSacCode: inputHsnSacCode,
    });
  };

  const handleArticleNameChange = (option) => {
    setEditArticleFormData({
      ...editArticleFormData,
      articleName: option.value,
    });
  };

  const handleArticleDescriptionChange = (e) => {
    setEditArticleFormData({
      ...editArticleFormData,
      articleDescription: e.target.value,
    });
  };

  const handleArticleImageChange = (e) => {
    if (e.target.files[0].size > 2000000) {
      console.log("Size more than 2MB");
      return;
    }
    setEditArticleFormData({
      ...editArticleFormData,
      articleImage: e.target.files[0],
    });
  };

  const handleEanChange = (e) => {
    const inputEan = parseInt(e.target.value);
    setEditArticleFormData({
      ...editArticleFormData,
      ean: inputEan,
    });
  };

  const handleSkuChange = (e) => {
    const inputSku = parseInt(e.target.value);
    setEditArticleFormData({
      ...editArticleFormData,
      sku: inputSku,
    });
  };

  const handleArticleCategoryChange = (option) => {
    setEditArticleFormData({
      ...editArticleFormData,
      articleCategory: option.value,
    });
  };

  const handleUnitChange = (option) => {
    setEditArticleFormData({
      ...editArticleFormData,
      unit: option.value,
    });
  };

  const handleGstRateChange = (option) => {
    setEditArticleFormData({
      ...editArticleFormData,
      gstRate: option.value,
    });
  };

  const handleMrpChange = (e) => {
    if (e.target.value === "") {
      setEditArticleFormData({ ...editArticleFormData, mrp: "" });
      return;
    }

    const inputMrp = parseFloat(e.target.value);

    setEditArticleFormData({
      ...editArticleFormData,
      mrp: inputMrp,
    });
  };

  const handleNetPurchasePriceChange = (e) => {
    if (e.target.value === "") {
      setEditArticleFormData({
        ...editArticleFormData,
        netPurchasePrice: "",
      });
      return;
    }

    const inputNetPurchasePrice = parseFloat(e.target.value);

    setEditArticleFormData({
      ...editArticleFormData,
      netPurchasePrice: inputNetPurchasePrice,
      grossPurchasePrice: (
        inputNetPurchasePrice *
        (1 + editArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleGrossPurchasePriceChange = (e) => {
    if (e.target.value === "") {
      setEditArticleFormData({
        ...editArticleFormData,
        grossPurchasePrice: "",
      });
      return;
    }

    const inputGrossPurchasePrice = parseFloat(e.target.value);

    setEditArticleFormData({
      ...editArticleFormData,
      grossPurchasePrice: inputGrossPurchasePrice,
      netPurchasePrice: (
        inputGrossPurchasePrice /
        (1 + editArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleNetSalesPriceChange = (e) => {
    if (e.target.value === "") {
      setEditArticleFormData({ ...editArticleFormData, netSalesPrice: "" });
      return;
    }

    const inputNetSalesPrice = parseFloat(e.target.value);

    setEditArticleFormData({
      ...editArticleFormData,
      netSalesPrice: inputNetSalesPrice,
      grossSalesPrice: (
        inputNetSalesPrice *
        (1 + editArticleFormData.gstRate / 100)
      ).toFixed(2),
      mrp: (
        inputNetSalesPrice *
        (1 + editArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleGrossSalesPriceChange = (e) => {
    if (e.target.value === "") {
      setEditArticleFormData({
        ...editArticleFormData,
        grossSalesPrice: "",
      });
      return;
    }

    const inputGrossSalesPrice = parseFloat(e.target.value);

    setEditArticleFormData({
      ...editArticleFormData,
      grossSalesPrice: inputGrossSalesPrice,
      mrp: inputGrossSalesPrice,
      netSalesPrice: (
        inputGrossSalesPrice /
        (1 + editArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleShowNotesToggle = () => {
    setEditArticleFormData({
      ...editArticleFormData,
      showNotes: !editArticleFormData.showNotes,
    });
  };

  const handleNotesChange = (e) => {
    setEditArticleFormData({
      ...editArticleFormData,
      notes: e.target.value,
    });
  };

  console.log(editArticleFormData, "EditArticleData");

  return (
    <PageContent
      loading={editArticleFormData.articleNumber ? false : true}
      title={"Edit Article"}
      breadCrumbData={["Home", "Articles", "Edit Article"]}
      titleActionContent={
        <Button onClick={handleEdit} isSuccess>
          Save
        </Button>
      }
    >
      <div className="columns is-multiline">
        <div className="column is-7">
          <AdvancedCard type={"s-card"}>
            <h2 className="title is-5 is-bold">Article Info</h2>
            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Article number *</label>
                  <Input
                    onChange={handleArticleNumberChange}
                    placeholder={"Enter Article number"}
                    type={"number"}
                    value={editArticleFormData.articleNumber}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>HSN/SAC Code *</label>
                  <Input
                    onChange={handleHsnSacCodeChange}
                    type={"number"}
                    placeholder={"E.g., 720991"}
                    value={editArticleFormData.hsnSacCode}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-12">
                <div className="field">
                  <label>Article name *</label>
                  <ArticleSearchComponent
                    value={{
                      label: editArticleFormData.articleName,
                      key: editArticleFormData.articleName,
                    }}
                    onChange={handleArticleNameChange}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Article description</label>
                  <TextArea
                    rows={3}
                    placeholder="Enter Details"
                    onChange={handleArticleDescriptionChange}
                    value={editArticleFormData.articleDescription}
                  />
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label>Article Image</label>
                  {editArticleFormData.articleImage ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt="Not found"
                        style={{
                          width: "290px",
                          height: "82px",
                          objectFit: "contain",
                        }}
                        src={URL.createObjectURL(
                          editArticleFormData.articleImage
                        )}
                      />
                      <br />
                      <p
                        className="button h-button"
                        onClick={() =>
                          setEditArticleFormData({
                            ...editArticleFormData,
                            articleImage: "",
                          })
                        }
                      >
                        Change Logo
                      </p>
                    </div>
                  ) : (
                    <FileInput
                      onChange={handleArticleImageChange}
                      errorMessage={""}
                      label={"Upload Article Image"}
                      description={"(Upload jpeg/png image upto 2 MB size)"}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-12">
                <div className="field">
                  <label>EAN *</label>
                  <Input
                    onChange={handleEanChange}
                    placeholder={"Enter EAN"}
                    type={"number"}
                    value={editArticleFormData.ean}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-12">
                <div className="field">
                  <label>SKU *</label>
                  <Input
                    onChange={handleSkuChange}
                    placeholder={"Enter SKU"}
                    type={"number"}
                    value={editArticleFormData.sku}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Article category *</label>
                  <SelectInput
                    onChange={handleArticleCategoryChange}
                    placeholder={<p>Search or type article name</p>}
                    options={[
                      { label: "Not specified", value: "Not specified" },
                      { label: "Equipment", value: "Equipment" },
                      { label: "Consulting", value: "Consulting" },
                      { label: "Spare parts", value: "Spare parts" },
                      { label: "Programming", value: "Programming" },
                    ]}
                    value={editArticleFormData.articleCategory}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Unit</label>
                  <SelectInput
                    onChange={handleUnitChange}
                    placeholder={<p>Choose units</p>}
                    options={[
                      { label: "meters", value: "meters" },
                      { label: "carton", value: "carton" },
                      { label: "m²", value: "m²" },
                      { label: "liters", value: "liters" },
                    ]}
                    value={editArticleFormData.unit}
                  />
                </div>
              </div>
            </div>
          </AdvancedCard>

          <div className="m-t-20" />

          <AdvancedCard type={"s-card"}>
            <h2 className="title is-5 is-bold">Price</h2>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>GST Rate *</label>
                  <SelectInput
                    onChange={handleGstRateChange}
                    options={[
                      { label: "0%", value: 0 },
                      { label: "3%", value: 3 },
                      { label: "5%", value: 5 },
                      { label: "12%", value: 12 },
                      { label: "18%", value: 18 },
                      { label: "28%", value: 28 },
                    ]}
                    placeholder={"Choose GST rate"}
                    value={editArticleFormData.gstRate}
                    defaultValue={0}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>MRP *</label>
                  <Input
                    onChange={handleMrpChange}
                    type={"number"}
                    placeholder={"₹ 0.00"}
                    value={editArticleFormData.mrp}
                  />
                </div>
              </div>
            </div>
            <div className="m-t-15" />

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Purchase Price (net) *</label>
                  <Input
                    onChange={handleNetPurchasePriceChange}
                    placeholder={"₹ 0.00"}
                    type={"number"}
                    value={editArticleFormData.netPurchasePrice}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Purchase Price (gross) *</label>
                  <Input
                    onChange={handleGrossPurchasePriceChange}
                    placeholder={"₹ 0.00"}
                    type={"number"}
                    value={editArticleFormData.grossPurchasePrice}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Sales price (net) *</label>
                  <Input
                    onChange={handleNetSalesPriceChange}
                    placeholder={"₹ 0.00"}
                    type={"number"}
                    value={editArticleFormData.netSalesPrice}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Sales Price (gross) *</label>
                  <Input
                    onChange={handleGrossSalesPriceChange}
                    placeholder={"₹ 0.00"}
                    type={"number"}
                    value={editArticleFormData.grossSalesPrice}
                  />
                </div>
              </div>
            </div>
          </AdvancedCard>
        </div>

        {/* Notes section */}
        <div className="column is-5">
          <AdvancedCard
            type={"s-card"}
            footer
            footerContentLeft={"Show notes when creating new documents"}
            footerContentRight={
              <Switch
                onChange={handleShowNotesToggle}
                checked={editArticleFormData.showNotes}
                isSuccess
              />
            }
          >
            <h2 className="title is-5 is-bold">Notes</h2>
            <TextArea
              rows={3}
              placeholder="Enter notes here"
              onChange={handleNotesChange}
              value={editArticleFormData.notes}
            />
          </AdvancedCard>
        </div>
      </div>
    </PageContent>
  );
};

export default EditArticle;
