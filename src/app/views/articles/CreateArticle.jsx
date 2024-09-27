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
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import ArticleSearchComponent from "../../shared/components/articleSearch/ArticleSearchComponent";

const CreateArticle = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [createArticleFormData, setCreateArticleFormData] = useState({
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
  const [articleImage, setArticleImage] = useState(null);

  const [formErrors, setFormErrors] = useState({
    articleImageError: "",
  });

  useEffect(() => {
    groflexService
      .request(config.resourceUrls.articleNumber, { auth: true })
      .then((res) => {
        setCreateArticleFormData({
          ...createArticleFormData,
          articleNumber: Number(res.body.data),
        });
        setLoading(false);
        // console.log(res, "Article Number");
      });
  }, []);

  const handleSave = () => {
    const payload = {
      avgPurchaseValue: 0,
      calculationBase: "net",
      category: createArticleFormData.articleCategory,
      currentStock: null,
      description: createArticleFormData.articleDescription,
      eanNo: createArticleFormData.ean.toString(),
      hsnSacCode: createArticleFormData.hsnSacCode.toString(),
      images: [],
      isValidated: false,
      metaData: {
        imageUrl: null,
      },
      minimumBalance: null,
      mrp: createArticleFormData.mrp,
      notesAlert: createArticleFormData.showNotes,
      number: createArticleFormData.articleNumber.toString(),
      openingBalance: null,
      price: createArticleFormData.netSalesPrice,
      priceGross: createArticleFormData.grossSalesPrice,
      purchasePrice: createArticleFormData.netPurchasePrice,
      purchasePriceGross: createArticleFormData.grossPurchasePrice,
      title: createArticleFormData.articleName,
      trackedInInventory: false,
      unit: createArticleFormData.unit,
      value: 0,
      vatPercent: createArticleFormData.gstRate,
      notes: createArticleFormData.notes,
      skuNo: String(createArticleFormData.sku),
    };
    groflexService
      .request(config.resourceUrls.article, {
        auth: true,
        data: payload,
        method: "POST",
      })
      .then((res) => {
        if (res.body.data) {
          groflexService.toast.success("Article created succesfully");
          navigate("/articles");
          // console.log(res, "Article created Succcessfullys");
        } else {
          groflexService.toast.error("Failed to create article");
          // console.log(res, "Article creation failed");
        }
      });

    console.log(payload);
  };

  const handleArticleNumberChange = (e) => {
    const inputArticleNumber = parseInt(e.target.value);
    setCreateArticleFormData({
      ...createArticleFormData,
      articleNumber: inputArticleNumber,
    });
  };

  const handleHsnSacCodeChange = (e) => {
    const inputHsnSacCode = parseInt(e.target.value);
    setCreateArticleFormData({
      ...createArticleFormData,
      hsnSacCode: inputHsnSacCode,
    });
  };

  const handleArticleNameChange = (option) => {
    setCreateArticleFormData({
      ...createArticleFormData,
      articleName: option.value,
    });
  };

  const handleArticleDescriptionChange = (e) => {
    setCreateArticleFormData({
      ...createArticleFormData,
      articleDescription: e.target.value,
    });
  };

  const handleArticleImageChange = (e) => {
    if (e.target.files[0].size > 2000000) {
      // console.log("Size more than 2MB");
      setFormErrors({
        ...formErrors,
        articleImageError: "Size more than 2MB",
      });
      return;
    }
    setCreateArticleFormData({
      ...createArticleFormData,
      articleImage: e.target.files[0],
    });
  };

  const handleEanChange = (e) => {
    const inputEan = parseInt(e.target.value);
    setCreateArticleFormData({
      ...createArticleFormData,
      ean: inputEan,
    });
  };

  const handleSkuChange = (e) => {
    const inputSku = parseInt(e.target.value);
    setCreateArticleFormData({
      ...createArticleFormData,
      sku: inputSku,
    });
  };

  const handleArticleCategoryChange = (option) => {
    setCreateArticleFormData({
      ...createArticleFormData,
      articleCategory: option.value,
    });
  };

  const handleUnitChange = (option) => {
    setCreateArticleFormData({
      ...createArticleFormData,
      unit: option.value,
    });
  };

  const handleGstRateChange = (option) => {
    setCreateArticleFormData({
      ...createArticleFormData,
      gstRate: option.value,
    });
  };

  const handleMrpChange = (e) => {
    if (e.target.value === "") {
      setCreateArticleFormData({ ...createArticleFormData, mrp: "" });
      return;
    }

    const inputMrp = parseFloat(e.target.value);

    setCreateArticleFormData({
      ...createArticleFormData,
      mrp: inputMrp,
    });
  };

  const handleNetPurchasePriceChange = (e) => {
    if (e.target.value === "") {
      setCreateArticleFormData({
        ...createArticleFormData,
        netPurchasePrice: "",
      });
      return;
    }

    const inputNetPurchasePrice = parseFloat(e.target.value);

    setCreateArticleFormData({
      ...createArticleFormData,
      netPurchasePrice: inputNetPurchasePrice,
      grossPurchasePrice: (
        inputNetPurchasePrice *
        (1 + createArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleGrossPurchasePriceChange = (e) => {
    if (e.target.value === "") {
      setCreateArticleFormData({
        ...createArticleFormData,
        grossPurchasePrice: "",
      });
      return;
    }

    const inputGrossPurchasePrice = parseFloat(e.target.value);

    setCreateArticleFormData({
      ...createArticleFormData,
      grossPurchasePrice: inputGrossPurchasePrice,
      netPurchasePrice: (
        inputGrossPurchasePrice /
        (1 + createArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleNetSalesPriceChange = (e) => {
    if (e.target.value === "") {
      setCreateArticleFormData({ ...createArticleFormData, netSalesPrice: "" });
      return;
    }

    const inputNetSalesPrice = parseFloat(e.target.value);

    setCreateArticleFormData({
      ...createArticleFormData,
      netSalesPrice: inputNetSalesPrice,
      grossSalesPrice: (
        inputNetSalesPrice *
        (1 + createArticleFormData.gstRate / 100)
      ).toFixed(2),
      mrp: (
        inputNetSalesPrice *
        (1 + createArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleGrossSalesPriceChange = (e) => {
    if (e.target.value === "") {
      setCreateArticleFormData({
        ...createArticleFormData,
        grossSalesPrice: "",
      });
      return;
    }

    const inputGrossSalesPrice = parseFloat(e.target.value);

    setCreateArticleFormData({
      ...createArticleFormData,
      grossSalesPrice: inputGrossSalesPrice,
      mrp: inputGrossSalesPrice,
      netSalesPrice: (
        inputGrossSalesPrice /
        (1 + createArticleFormData.gstRate / 100)
      ).toFixed(2),
    });
  };

  const handleShowNotesToggle = () => {
    setCreateArticleFormData({
      ...createArticleFormData,
      showNotes: !createArticleFormData.showNotes,
    });
  };

  const handleNotesChange = (e) => {
    setCreateArticleFormData({
      ...createArticleFormData,
      notes: e.target.value,
    });
  };

  console.log(createArticleFormData, "createArticle Data");

  return (
    <PageContent
      loading={loading}
      title={"Create Article"}
      breadCrumbData={["Home", "Articles", "Create Article"]}
      titleActionContent={
        <Button onClick={handleSave} isSuccess>
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
                    value={createArticleFormData.articleNumber}
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
                    value={createArticleFormData.hsnSacCode}
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
                      label: createArticleFormData.articleName,
                      key: createArticleFormData.articleName,
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
                    value={createArticleFormData.articleDescription}
                  />
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label>Article Image</label>
                  {createArticleFormData.articleImage ? (
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
                          createArticleFormData.articleImage
                        )}
                      />
                      <br />
                      <p
                        className="button h-button"
                        onClick={() => {
                          setFormErrors({
                            articleImageError: "",
                          });
                          setCreateArticleFormData({
                            ...createArticleFormData,
                            articleImage: "",
                          });
                        }}
                      >
                        Change Image
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
                    value={createArticleFormData.ean}
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
                    value={createArticleFormData.sku}
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
                    value={createArticleFormData.articleCategory}
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
                    value={createArticleFormData.unit}
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
                    value={createArticleFormData.gstRate}
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
                    value={createArticleFormData.mrp}
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
                    value={createArticleFormData.netPurchasePrice}
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
                    value={createArticleFormData.grossPurchasePrice}
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
                    value={createArticleFormData.netSalesPrice}
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
                    value={createArticleFormData.grossSalesPrice}
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
                checked={createArticleFormData.showNotes}
                isSuccess
              />
            }
          >
            <h2 className="title is-5 is-bold">Notes</h2>
            <TextArea
              rows={3}
              placeholder="Enter notes here"
              onChange={handleNotesChange}
              value={createArticleFormData.notes}
            />
          </AdvancedCard>
        </div>
      </div>
    </PageContent>
  );
};

export default CreateArticle;
