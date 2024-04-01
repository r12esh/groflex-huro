import React, { useEffect, useState } from "react";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import groflexService from "../../services/groflex.service";
import oldConfig from "../../../../oldConfig";
import { useNavigate } from "react-router-dom";

const GlobalSearch = ({ isSeachVisible, setIsSearchVisible }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (searchText.length > 0) {
      fetchSearchResults();
    }
  }, [searchText]);

  const fetchSearchResults = () => {
    groflexService
      .request(`${oldConfig.resourceHost}search/${searchText}`, { auth: true })
      .then((res) => {
        if (res.body.data) {
          const response = res.body.data;

          createSearchResultEntry(response);
        }
      });
  };
  const createSearchResultEntry = (response) => {
    const results = [];
    if (response.articles.length > 0) {
      const items = response.articles.map((item) => (
        <a
          className="media-flex-center"
          onClick={() => navigate(`/articles/${item.id}`)}
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"Inbox"} />
          </div>
          <div className="flex-meta">
            <span>{item.title}</span>
            <span>Article No. {item.number}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Articles</h2>
          {items}
        </div>
      );
    }
    if (response.customers.length > 0) {
      const items = response.customers.map((item) => (
        <a
          className="media-flex-center"
          onClick={() => navigate(`/contacts/${item.id}`)}
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"User"} />
          </div>
          <div className="flex-meta">
            <span>{item.firstName ? item.firstName : item.companyName}</span>
            <span>Customer No. {item.number}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Customers</h2>
          {items}
        </div>
      );
    }

    if (response.invoices.length > 0) {
      const items = response.invoices.map((item) => (
        <a
          className="media-flex-center"
          onClick={() => navigate(`/sales/invoices/${item.id}`)}
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"Book"} />
          </div>
          <div className="flex-meta">
            <span></span>
            <span>Invoice No. {item.number}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Invoices</h2>
          {items}
        </div>
      );
    }

    if (response.offers.length > 0) {
      const items = response.offers.map((item) => (
        <a
          className="media-flex-center"
          onClick={() => navigate(`/sales/quotations/${item.id}`)}
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"Book"} />
          </div>
          <div className="flex-meta">
            <span></span>
            <span>Quotation No. {item.number}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Quotations</h2>
          {items}
        </div>
      );
    }

    if (response.expenses.length > 0) {
      const items = response.expenses.map((item) => (
        <a
          className="media-flex-center"
          onClick={() => navigate(`/accounting/expenses`)}
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"Book"} />
          </div>
          <div className="flex-meta">
            <span></span>
            <span>Expense No. {item.number ? item.number : item.id}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Expenses</h2>
          {items}
        </div>
      );
    }

    if (response.recurringInvoices.length > 0) {
      const items = response.recurringInvoices.map((item) => (
        <a
          className="media-flex-center"
          onClick={() => navigate(`/sales/recurring-invoices/${item.id}`)}
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"Book"} />
          </div>
          <div className="flex-meta">
            <span></span>
            <span>Recurring Invoice No. {item.id}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Recurring Invoices</h2>
          {items}
        </div>
      );
    }

    if (response.trackedTimes.length > 0) {
      const items = response.trackedTimes.map((item) => (
        <a
          className="media-flex-center"
          onClick={() =>
            navigate(
              `/sales/time-sheets/billed/customer/${item.id}/${item.status}`
            )
          }
        >
          <div className="h-icon  is-rounded is-small">
            <FeatherIcon name={"Book"} />
          </div>
          <div className="flex-meta">
            <span></span>
            <span>Time Record No. {item.id}</span>
          </div>
          <FeatherIcon
            name={"ArrowUpRight"}
            style={{ position: "absolute", right: "30px" }}
          />
        </a>
      ));
      results.push(
        <div className="recent-block">
          <h2>Time Records</h2>
          {items}
        </div>
      );
    }
    setSearchResults(results);
  };
  return (
    <div
      id="search-panel"
      className={`right-panel-wrapper is-search is-left global-search-wrapper ${
        isSeachVisible ? "is-active" : ""
      }`}
    >
      <div className="panel-overlay"></div>
      <div className="right-panel">
        <div className="right-panel-head">
          <h1>Search</h1>
          <a className="close-panel" onClick={() => setIsSearchVisible(false)}>
            <FontAwesomeIcon name={"xmark"} color="#00A353" />
          </a>
        </div>

        <div className="right-panel-body has-slimscroll">
          <div className="field" style={{ padding: "20px" }}>
            <div className="control has-icon">
              <input
                type="text"
                className="input is-rounded search-input"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="form-icon">
                <FeatherIcon name={"Search"} />
              </div>
              <div className="search-results has-slimscroll"></div>
            </div>
          </div>
          <div className="recent">
            <h4 style={{ textAlign: "center" }}>Search Results</h4>
            {searchResults}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
