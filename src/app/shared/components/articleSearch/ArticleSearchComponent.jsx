import React, { useState } from "react";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../config";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { debounce } from "lodash";

const ArticleSearchComponent = ({ value, onChange }) => {
  const [article, setArticle] = useState(value);

  const handleChange = (option) => {
    setArticle(option);
    onChange(option);
  };

  const handleLoadOptions = (inputString) => {
    if (!inputString || inputString?.length < 3) return;
    // console.log("Mapped options");
    const queryString = inputString.trim();

    return groflexService
      .request(`${config.resourceUrls.articleSearch}${queryString}`, {
        auth: true,
      })
      .then((response) => {
        const {
          body: { data: eanRecords },
        } = response;
        const mappedOptions = eanRecords.map((eanData) => {
          const { mrp, name } = eanData;
          return {
            label: `${name}, ${formatCurrency(mrp)}`,
            value: eanData.name,
            eanData,
          };
        });
        console.log(mappedOptions, "Mapped options");
        return mappedOptions;
      });
  };

  const debouncedResults = debounce(handleLoadOptions, 300);

  return (
    <SelectInput
      isCreatable
      isAsync
      // loadOptions={handleLoadOptions}
      loadOptions={debouncedResults}
      onChange={handleChange}
      value={article}
      // onInputChange={handleInputChange}
    />
  );
};

export default ArticleSearchComponent;
// const handleOnChange = (option) => {
//   onChange(option);
//   setArticle(option);
// };

// const loadArticleOptions = (inputString) => {
//   if (!inputString) return;

//   const getOptions = (searchTerm) => {
//     if (searchTerm.trim().length >= 2) {
//       return fetchEanRecords(searchTerm.trim());
//     }
//   };

//   const fetchEanRecords = (searchTerm) => {
//     searchTerm = searchTerm;
//     return groflexService
//       .request(`${config.resourceUrls.articleSearch}${inputString}`, {
//         auth: true,
//       })
//       .then((response) => {
//         const {
//           body: { data: eanRecords },
//         } = response;
//         const mappedOptions = eanRecords.map((eanData) => {
//           const { mrp, name } = eanData;

//           return {
//             value: eanData.name,
//             label: `${name}, ${formatCurrency(mrp)}`,
//             eanData,
//           };
//         });

//         return { options: mappedOptions };
//       });
//   };

//   return {
//     placeholder: "Article Name",
//     labelKey: "label",
//     valueKey: "value",
//     loadOptions: debounce(getOptions, 300),
//     handleChange: (option) => handleOnChange(option),
//   };
// };
