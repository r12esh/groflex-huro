import React, { useState, useEffect, useRef } from 'react';
import Modal from "../modal/Modal";
import { Input } from '../input/Input';
import { SelectInput } from '../select/SelectInput';
import { InputAddons } from '../inputAddons/InputAddons';
import { AdvancedCard } from '../cards/AdvancedCard';
import { Switch } from '../switch/Switch';
import { TextArea } from '../textArea/TextArea';
import moment from 'moment';
import GroflexService from '../../../services/groflex.service';
import config from "../../../../../newConfig";
import LoaderSpinner from '../loaderSpinner/LoaderSpinner';

const INVOICE_VIEW = "invoice";
const OFFER_VIEW = "offer";
const PURCHASE_ORDER_VIEW = "purchaseOrder";
const YEAR_KEY = "YYYY";
const YEAR_SHORT_KEY = "YY";
const YEAR_MONTH_KEY = "YYYYMM";
const YEAR_SHORT_MONTH_KEY = "YYMM";
const YEAR_MONTH_DAY_KEY = "YYYYMMDD";
const YEAR_SHORT_MONTH_DAY_KEY = "YYMMDD";
const FY_KEY = "YYYYYY";

const FREQUENCY_YEAR = "yearly";
const FREQUENCY_MONTH = "monthly";
const FREQUENCY_DAY = "daily";

const NumberRangeModal = ({ isActive = false, setIsActive, numerationType, handlePostData, isLoading }) => {

    const [numerationData, setNumerationData] = useState({})

    const [newNumberRange, setNewNumberRange] = useState({
        prefix: "",
        datePart: "",
        formattedDatePart: "",
        serialNumber: 4,
        surfix: "",
        placeholder1: "",
        placeholder2: "",
        placeholder3: "",
        resetPeriodically: false,
        resetInterval: "yearly",
        numberIncrement: 1,
        startFrom: 1,
        numberFrom: "",
        currentNumber: "",
        currentValue: "1"
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewNumberRange((prevNumberRange) => ({
            ...prevNumberRange,
            [name]: value
        }));
    };

    const handleResetPeriodically = (e) => {
        let isPeriodically = e.target.checked
        setNewNumberRange({
            ...newNumberRange,
            resetPeriodically: !newNumberRange.resetPeriodically,
        });
        if (isPeriodically && newNumberRange.resetInterval == FREQUENCY_YEAR) {
            handleDatePartChange({ value: FY_KEY })
        } else if (isPeriodically && newNumberRange.resetInterval == FREQUENCY_MONTH) {
            handleDatePartChange({ value: YEAR_SHORT_MONTH_KEY })
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                numberFrom: ''
            }));
        } else if (isPeriodically && newNumberRange.resetInterval == FREQUENCY_DAY) {
            handleDatePartChange({ value: YEAR_SHORT_MONTH_DAY_KEY })
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                numberFrom: ''
            }));
        } else {
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                formattedDatePart: '',
                datePart: '',
                numberFrom: ''
            }));
        }

    };
    const handleResetIntervalChange = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            resetInterval: options.value
        }));
        if (options.value == FREQUENCY_YEAR) {
            handleDatePartChange({ value: FY_KEY })
        } else if (options.value == FREQUENCY_MONTH) {
            handleDatePartChange({ value: YEAR_SHORT_MONTH_KEY })
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                numberFrom: ''
            }));
        } else if (options.value == FREQUENCY_DAY) {
            handleDatePartChange({ value: YEAR_SHORT_MONTH_DAY_KEY })
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                numberFrom: ''
            }));
        } else {
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                formattedDatePart: '',
                datePart: '',
                numberFrom: ''
            }));
        }
    };

    const handlePlaceHolder1Change = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            placeholder1: options.value
        }));
    };
    const handlePlaceHolder2Change = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            placeholder2: options.value
        }));
    };
    const handlePlaceHolder3Change = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            placeholder3: options.value
        }));
    };
    const handleSubFrequencyChange = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            numberFrom: options.value
        }));
    };

    const handleSerialNumberChange = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            serialNumber: options.value
        }));

        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            currentNumber: String(newNumberRange.currentValue).padStart(options.value, '0')
        }));
    }

    const handleDatePartChange = (options) => {
        let formattedDate = '';
        switch (options.value) {
            case YEAR_KEY:
                formattedDate = moment().format("YYYY");
                break;
            case YEAR_SHORT_KEY:
                formattedDate = moment().format("YY");
                break;
            case YEAR_MONTH_KEY:
                formattedDate = moment().format("YYYYMM");
                break;
            case YEAR_SHORT_MONTH_KEY:
                formattedDate = moment().format("YYMM");
                break;
            case YEAR_MONTH_DAY_KEY:
                formattedDate = moment().format("YYYYMMDD");
                break;
            case YEAR_SHORT_MONTH_DAY_KEY:
                formattedDate = moment().format("YYMMDD");
                break;
            case FY_KEY:
                const currentYear = moment().format("YYYY");
                const nextYear = moment().add(1, 'years').format("YYYY");
                formattedDate = currentYear + nextYear.slice(-2);
                break;
            default:
                // Handle default case
                break;
        }

        // Update state with the formattedDate
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            formattedDatePart: formattedDate,
            datePart: options.value
        }));
    };

    const dateOptions = [
        {
            label: "None",
            value: "",
            disabled: false,
        },
        {
            label: `YY`,
            value: YEAR_SHORT_KEY,
            disabled: false,
        },
        {
            label: `YYYY`,
            value: YEAR_KEY,
            disabled: false,
        },
        {
            label: `FY - YYYYYY`,
            value: FY_KEY,
            disabled: true,
        },
        {
            label: `YYMM`,
            value: YEAR_SHORT_MONTH_KEY,
            disabled: false,
        },
        {
            label: `YYYYMM`,
            value: YEAR_MONTH_KEY,
            disabled: false,
        },
        {
            label: `YYMMDD`,
            value: YEAR_SHORT_MONTH_DAY_KEY,
            disabled: false,
        },
        {
            label: `YYYYMMDD`,
            value: YEAR_MONTH_DAY_KEY,
            disabled: false,
        },
    ]
    const frequencyOptions = [
        {
            label: `Yearly`,
            value: FREQUENCY_YEAR,
        },
        {
            label: `Monthly`,
            value: FREQUENCY_MONTH,
        },
        {
            label: `Daily`,
            value: FREQUENCY_DAY,
        },
    ]

    const placeholderLoadedOptions = [
        {
            label: "",
            value: ""
        },
        {
            label: "-",
            value: "-",
        },
        {
            label: "/",
            value: "/",
        },
        {
            label: "|",
            value: "|",
        },
    ];

    const numberFrom = [
        { value: "January", label: "January" },
        { value: "February", label: "February" },
        { value: "March", label: "March" },
        { value: "April", label: "April" },
        { value: "May", label: "May" },
        { value: "June", label: "June" },
        { value: "July", label: "July" },
        { value: "August", label: "August" },
        { value: "September", label: "September" },
        { value: "October", label: "October" },
        { value: "November", label: "November" },
        { value: "December", label: "December" }
    ];

    const serialNumber = [
        { value: "2", label: "2-digit" },
        { value: "3", label: "3-digit" },
        { value: "4", label: "4-digit" },
        { value: "5", label: "5-digit" },
        { value: "6", label: "6-digit" },
        { value: "7", label: "7-digit" },
        { value: "8", label: "8-digit" },
        { value: "9", label: "9-digit" },
        { value: "10", label: "10-digit" }
    ];

    const containerRef = useRef(null);
    const [clickedElement, setClickedElement] = useState(null);

    const handleClick = (id) => {
        setClickedElement(id === clickedElement ? null : id);
    };

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setClickedElement(null);
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    // get existing Numeration data
    const fetchNumerationData = () => {
        GroflexService.request(`${config.resourceUrls.numeration}`, {
            method: "GET",
            auth: true,
        })
            .then(async (response) => {
                const responseData = response.body.data;
                if (numerationData) {
                    if (numerationType && responseData.hasOwnProperty(numerationType)) {
                        // setNumerationData(numerationData[numerationType]);
                        let numerationData = responseData[numerationType]
                        setNewNumberRange(prevState => ({
                            ...prevState,
                            prefix: numerationData.prefix,
                            datePart: numerationData.datePart,
                            serialNumber: numerationData.counterLength,
                            surfix: numerationData.suffix,
                            placeholder1: numerationData.placeHolder1,
                            placeholder2: numerationData.placeHolder2,
                            placeholder3: numerationData.placeHolder3,
                            resetPeriodically: numerationData.isPeriodic,
                            resetInterval: numerationData.frequency || 'yearly',
                            numberIncrement: numerationData.increment,
                            startFrom: numerationData.startValue,
                            numberFrom: numerationData.subFrequency,
                            currentNumber: String(numerationData.currentValue).padStart(numerationData.counterLength, '0'),
                            currentValue: numerationData.currentValue
                        }));
                        handleDatePartChange({ value: numerationData.datePart })
                    } else {
                        setNumerationData({});
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching contact:", error);
            });
    };

    useEffect(() => {
        if (numerationType) {
            fetchNumerationData();
        }
    }, [numerationType]);

    const handleSaveButton = () => {
        let numerationData = {
            counterLength: newNumberRange.serialNumber,
            datePart: newNumberRange.datePart,
            prefix: newNumberRange.prefix,
            relationKind: numerationType,
            suffix: newNumberRange.surfix,
            placeHolder1: newNumberRange.placeholder1,
            placeHolder2: newNumberRange.placeholder2,
            placeHolder3: newNumberRange.placeholder3,
            isPeriodic: newNumberRange.resetPeriodically,
            frequency: newNumberRange.resetInterval,
            subFrequency: newNumberRange.numberFrom,
            currentValue: parseInt(newNumberRange.currentNumber),
            increment: newNumberRange.numberIncrement,
            startValue: newNumberRange.startFrom
        }
        handlePostData(numerationData)
    }

    return (
        <Modal
            title="Number Range"
            submitBtnName="Save"
            isActive={isActive}
            setIsAcive={setIsActive}
            isBig="is-big"
            onSubmit={handleSaveButton}

        >

            <LoaderSpinner
                visible={isLoading}
                message={"Wait..."}
                size="50"
                containerStyle={{ position: "absolute" }}

            />
            <div className="numeration-result">
                <div className='column is-12' ref={containerRef}>
                    <div className='field m-1'>
                        <span className={clickedElement === 'prefixHover' ? "triggeredHover" : ""} onClick={() => handleClick('prefixHover')}>{newNumberRange.prefix}</span>
                    </div>
                    <div className='field m-1'>
                        <span className={clickedElement === 'placeHolder1Hover' ? "triggeredHover" : ""} onClick={() => handleClick('placeHolder1Hover')}>{newNumberRange.placeholder1}</span>
                    </div>
                    <div className='field m-1'>
                        <span className={clickedElement === 'datePart' ? "triggeredHover" : ""} onClick={() => handleClick('datePart')}>{newNumberRange.formattedDatePart}</span>
                    </div>
                    <div className='field m-1'>
                        <span className={clickedElement === 'placeHolder2Hover' ? "triggeredHover" : ""} onClick={() => handleClick('placeHolder2Hover')}>{newNumberRange.placeholder2}</span>
                    </div>
                    <div className={`field numeration-input-box digits-${newNumberRange.serialNumber} m-1`}>
                        <InputAddons
                            type="text"
                            name="currentNumber"
                            placeholder={newNumberRange.currentNumber}
                            value={newNumberRange.currentNumber}
                            // defaultValue= {newNumberRange.currentNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='field m-1'>
                        <span className={clickedElement === 'placeHolder3Hover' ? "triggeredHover" : ""} onClick={() => handleClick('placeHolder3Hover')}>{newNumberRange.placeholder3}</span>
                    </div>
                    <div className='field m-1'>
                        <span className={clickedElement === 'surfixHover' ? "triggeredHover" : ""} onClick={() => handleClick('surfixHover')}>{newNumberRange.surfix}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSaveButton}>

                <div className="columns is-multiline m-b-5">
                    <div className="column is-2">
                        <div className="field">
                            <label>Prefix</label>
                            <Input
                                type="text"
                                name="prefix"
                                placeholder=""
                                maxLength="3"
                                value={newNumberRange.prefix}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="column is-1 numeration-placeholder seperator-remove">
                        <div className="field numeration-dropdown">
                            <SelectInput
                                options={placeholderLoadedOptions}
                                value={newNumberRange.placeholder1}
                                // placeholder={''}
                                onChange={handlePlaceHolder1Change}
                            />
                        </div>
                    </div>
                    <div className="column is-3 seperator-remove">
                        <div className="field">
                            <label>Date</label>
                            <SelectInput
                                options={dateOptions}
                                value={newNumberRange.formattedDatePart}
                                placeholder={"None"}
                                onChange={handleDatePartChange}
                            />
                        </div>
                    </div>
                    <div className="column is-1 numeration-placeholder seperator-remove">
                        <div className="field numeration-dropdown">
                            <SelectInput
                                options={placeholderLoadedOptions}
                                value={newNumberRange.placeholder2}
                                placeholder={''}
                                onChange={handlePlaceHolder2Change}
                            />
                        </div>
                    </div>
                    <div className="column is-2 seperator-remove">
                        <div className="field">
                            <label>Serial No.</label>
                            <SelectInput
                                options={serialNumber}
                                value={newNumberRange.serialNumber}
                                placeholder={newNumberRange.serialNumber + '-digits'}
                                onChange={handleSerialNumberChange}
                            />
                        </div>
                    </div>
                    <div className="column is-1 numeration-placeholder seperator-remove">
                        <div className="field numeration-dropdown">
                            <SelectInput
                                options={placeholderLoadedOptions}
                                value={newNumberRange.placeholder3}
                                // placeholder={newNumberRange.placeholder3}
                                onChange={handlePlaceHolder3Change}
                                placeholder={""}
                            />
                        </div>
                    </div>
                    <div className="column is-2 ">
                        <div className="field">
                            <label>Suffix</label>
                            <Input
                                type="text"
                                name="surfix"
                                placeholder=""
                                value={newNumberRange.surfix}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="columns is-multiline m-b-5">
                    <div className="column is-4">
                        <div className="field">
                            <label>Increment number by</label>
                            <InputAddons
                                type="number"
                                name="numberIncrement"
                                placeholder=""
                                defaultValue={1}
                                value={newNumberRange.numberIncrement}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="columns is-multiline m-b-5">
                    <div className="column is-4">
                        <label className=''>Reset numbers periodically</label>
                    </div>
                    <div className="column is-4">
                        <Switch
                            onChange={handleResetPeriodically}
                            checked={newNumberRange.resetPeriodically}
                            isSuccess
                        />
                    </div>
                </div>
                {
                    newNumberRange.resetPeriodically ?
                        <div className="columns is-multiline m-b-5">
                            <div className="column is-4 seperator-remove">
                                <div className="field">
                                    <label>Number reset interval</label>
                                    <SelectInput
                                        options={frequencyOptions}
                                        value={newNumberRange.resetInterval}
                                        placeholder={''}
                                        onChange={handleResetIntervalChange}
                                    />
                                </div>
                            </div>
                            {
                                newNumberRange.resetInterval == FREQUENCY_YEAR ?
                                    <div className="column is-4 seperator-remove">
                                        <div className="field">
                                            <label>Reset number from</label>
                                            <SelectInput
                                                options={numberFrom}
                                                value={newNumberRange.numberFrom}
                                                placeholder={'Choose'}
                                                onChange={handleSubFrequencyChange}
                                            />
                                        </div>
                                    </div> : ''
                            }
                            <div className="column is-4">
                                <div className="field">
                                    <label>Start number from</label>
                                    <InputAddons
                                        type="number"
                                        name="startFrom"
                                        placeholder=""
                                        defaultValue={1}
                                        value={newNumberRange.startFrom}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        : ''
                }
            </form>
        </Modal >
    );
};

export default NumberRangeModal;
