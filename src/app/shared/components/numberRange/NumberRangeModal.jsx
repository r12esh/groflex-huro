import React, { useState, useEffect, useRef } from 'react';
import Modal from "../modal/Modal";
import { Input } from '../input/Input';
import { SelectInput } from '../select/SelectInput';
import { InputAddons } from '../inputAddons/InputAddons';
import { Switch } from '../switch/Switch';
import moment from 'moment';
import GroflexService from '../../../services/groflex.service';
import config from "../../../../../newConfig";
import LoaderSpinner from '../loaderSpinner/LoaderSpinner';
import ErrorText from '../errorText/ErrorText';
import resources from '../../resources/resources';

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

const NumberRangeModal = ({ isActive = false, setIsActive, numerationType, isLoading, setIsLoading }) => {

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
        if (name == 'currentNumber' && isNaN(value)) {
            return
        }
        validation(name, value)
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
                numberFrom: 'January'
            }));
        } else if (isPeriodically && newNumberRange.resetInterval == FREQUENCY_DAY) {
            handleDatePartChange({ value: YEAR_SHORT_MONTH_DAY_KEY })
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                numberFrom: 'January'
            }));
        } else {
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                formattedDatePart: '',
                datePart: '',
                numberFrom: 'January',
                startFrom: 1
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
                numberFrom: 'January'
            }));
        } else if (options.value == FREQUENCY_DAY) {
            handleDatePartChange({ value: YEAR_SHORT_MONTH_DAY_KEY })
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                numberFrom: 'January'
            }));
        } else {
            setNewNumberRange((prevNewNumberRange) => ({
                ...prevNewNumberRange,
                formattedDatePart: '',
                datePart: '',
                numberFrom: 'January'
            }));
        }
    };

    const handlePlaceHolder1Change = (options) => {
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            placeholder1: options.value
        }));
    };
    const handleViewNumberChange = (event) => {
        const { name, value } = event.target;
        if (name == 'currentNumber' && isNaN(value)) {
            return
        }
        let inputValue = value;
        let serialNumber = newNumberRange.serialNumber;

        if (inputValue.length > serialNumber) {
            inputValue = inputValue.slice(0, serialNumber);
        }
        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            currentNumber: String(inputValue).padStart(serialNumber, '0'),
            currentValue: parseInt(inputValue)
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

        let fromattedCurrentValue = newNumberRange.currentNumber
        if (fromattedCurrentValue.length > Number(options.value)) {
            fromattedCurrentValue = fromattedCurrentValue.slice(0, options.value);
        }

        setNewNumberRange((prevNewNumberRange) => ({
            ...prevNewNumberRange,
            currentNumber: String(fromattedCurrentValue).padStart(options.value, '0'),
            currentValue: parseInt(fromattedCurrentValue)
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
                            currentNumber: String(numerationData.currentValue + 1).padStart(numerationData.counterLength, '0'),
                            currentValue: numerationData.currentValue + 1
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

    const [error, setError] = useState({
        prefix: "",
        suffix: "",
        currentNumber: "",
        increment: "",
        startFrom: ""
    });

    // validation
    const validation = (name, value) => {
        if (value.length == 1 && name == 'prefix' && !isNaN(value.charAt(0))) {
            setError({
                ...error,
                prefix: resources.numerationPrefixError,
            });
            return;
        } else if (value.length == 2 && value.length !== 3 && name == 'prefix' && !isNaN(value.charAt(1))) {
            setError({
                ...error,
                prefix: resources.numerationPrefixErrorMessage,
            });
            return;
        } else if (value.length == 3 && name == 'prefix' && !isNaN(value.charAt(2))) {
            setError({
                ...error,
                prefix: resources.numerationPrefixErrorMessage,
            });
            return;
        } else if (value.length == 1 && name == 'surfix' && !isNaN(value.charAt(0))) {
            setError({
                ...error,
                suffix: resources.numerationSuffixErrorMessage,
            });
            return;
        } else if (value.length == 2 && value.length !== 3 && name == 'surfix' && !isNaN(value.charAt(1))) {
            setError({
                ...error,
                suffix: resources.numberationSuffixError,
            });
            return;
        } else if (value.length == 3 && name == 'surfix' && !isNaN(value.charAt(2))) {
            setError({
                ...error,
                suffix: resources.numberationSuffixError,
            });
            return;
        } else if (name == 'numberIncrement' && !isNaN(value) && value < 1) {
            setError({
                ...error,
                increment: resources.numerationIncrementNumberError,
            });
            return;
        } else if (name == 'startFrom' && !isNaN(value) && value < 1) {
            setError({
                ...error,
                startFrom: resources.numerationStartValueNumberError,
            });
            return;
        }
        // else if (name == 'currentNumber' && isNaN(value)) {
        //     setError({
        //         ...error,
        //         currentNumber: resources.numerationNumericError,
        //     });
        // }
        else {
            setError({
                ...error,
                prefix: "",
                suffix: "",
                currentNumber: "",
                increment: "",
                startFrom: ""
            });
        }
        return
    }

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
            currentValue: parseInt(newNumberRange.currentNumber - 1),
            increment: newNumberRange.numberIncrement,
            startValue: newNumberRange.startFrom
        }
        if (!error.prefix && !error.suffix && !error.currentNumber && !error.increment && !error.startFrom) {
            handlePostNumerationData(numerationData)
        } else {
            GroflexService.toast.error(`Input error!\n ${error.prefix} \n ${error.suffix} \n ${error.currentNumber} \n ${error.increment} \n ${error.startFrom}`)
        }

    }
    // post data for numeration
    const handlePostNumerationData = (numerationData) => {
        setIsLoading(true)
        GroflexService
            .request(`${config.resourceUrls.changeNumeration(numerationType)}`, {
                auth: true,
                data: numerationData,
                method: "POST",
            })
            .then((res) => {
                if (res.body?.message) {
                    console.log(res.body?.message)
                    GroflexService.toast.error("Something went wrong");
                    setIsLoading(false)
                    setIsActive(false)
                } else {
                    GroflexService.toast.success(resources.numerationSaveSuccess);
                    setIsLoading(false)
                    setIsActive(false)
                }
            });
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
            <div className="title is-5 no-margin-bottom">{numerationType && numerationType == 'offer'? 'Quotation' : numerationType || '' }</div>
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
                    <div className={`field numeration-input-box digits-${newNumberRange.serialNumber} m-1`}
                        style={{ display: "block" }}
                    >
                        <InputAddons
                            type="text"
                            name="currentNumber"
                            // placeholder={newNumberRange.currentNumber}
                            value={newNumberRange.currentNumber}
                            // defaultValue= {newNumberRange.currentNumber}
                            // onChange= {handleViewNumberChange}
                            onChange={handleInputChange}
                            onBlur={handleViewNumberChange}
                        />
                        <ErrorText
                            visible={error.currentNumber}
                            text={error.currentNumber}
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
                            <ErrorText
                                visible={error.prefix}
                                text={error.prefix}
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
                                value={newNumberRange.datePart}
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
                                maxLength="3"
                                placeholder=""
                                value={newNumberRange.surfix}
                                onChange={handleInputChange}
                            />
                            <ErrorText
                                visible={error.suffix}
                                text={error.suffix}
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
                                value={newNumberRange.numberIncrement}
                                onChange={handleInputChange}
                            />
                            <ErrorText
                                visible={error.increment}
                                text={error.increment}
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
                                        value={newNumberRange.startFrom}
                                        onChange={handleInputChange}
                                    />
                                    <ErrorText
                                        visible={error.startFrom}
                                        text={error.startFrom}
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
