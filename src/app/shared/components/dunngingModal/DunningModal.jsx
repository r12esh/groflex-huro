import React, { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import HtmlInputComponent from "../input/HtmlInputComponent";
import config from "../../../../../newConfig";
import GroflexService from '../../../services/groflex.service';
import LoaderSpinner from "../loaderSpinner/LoaderSpinner";
import { InputAddons } from "../inputAddons/InputAddons";
import { Switch } from "../switch/Switch";
import resources from "../../../shared/resources/resources";

const DunningModal = ({ isActive, setIsActive, isLoading, setIsLoading }) => {

    const [dunningData, setDunningData] = useState([])

    // get dunning data
    const fetchDunningData = () => {
        GroflexService.request(`${config.resourceUrls.dunningLevel}`, {
            method: "GET",
            auth: true,
        })
            .then(async (response) => {
                const responseData = response.body.data;
                setDunningData(responseData)
            })
            .catch((error) => {
                console.error("Error fetching contact:", error);
            });
    };

    useEffect(() => {

        fetchDunningData();
    }, []);


    const [openModuleIndex, setOpenModuleIndex] = useState(-1);

    const handleToggleModule = (idx) => {
        setOpenModuleIndex(idx === openModuleIndex ? -1 : idx);
    };


    const handleToggle = (idx, e) => {
        const { checked } = e.target || {};
        if (checked !== undefined) {
            setDunningData(prevData => {
                const newData = [...prevData];
                newData[idx].active = checked;
                return newData;
            });
        }
    };

    const handleInputChange = (idx, field, value) => {
        setDunningData(prevData => {
            const newData = [...prevData];
            newData[idx][field] = value;
            return newData;
        });
    };

    const handleSaveButton = () => {

        const updateDunning = async () => {
            try {
                let successCount = 0;
                for (const data of dunningData) {
                    await GroflexService.request(`${config.resourceUrls.dunningLevel}/${data.id}`, {
                        auth: true,
                        data: data,
                        method: "PUT",
                    });
                    successCount++;
                }
                if (successCount === dunningData.length) {
                    GroflexService.toast.success(resources.str_editSuccessMessage);
                }
            } catch (error) {
                console.error("Error occurred while updating Dunning:", error);
                GroflexService.toast.error("Something went wrong");
            } finally {
                setIsLoading(false)
                setIsActive(false);
            }
        };

        if(dunningData.length > 0){
            updateDunning();
            setIsLoading(true)
        }

    }

    return (
        <div className="send-email-modal-wrapper">
            <Modal
                isActive={isActive}
                setIsAcive={setIsActive}
                title={'Dunning'}
                onSubmit={handleSaveButton}
                submitBtnName={"Save"}
                isBig
            >
                <LoaderSpinner
                    visible={isLoading}
                    message={"Wait..."}
                    size="50"
                />
                {/* sub title */}
                <div className="columns m-b-5 modal-form no-margin-left no-margin-right no-margin-top">
                    <div className="column is-12">
                        <div className="field">
                            {/* <div className="title is-5 no-margin-bottom">{textModuleType ? textModuleType : ''}</div> */}
                            <label>{`To collect overdue payments, you can activate up to 4 dunning levels. You can define the number of days between each dunning level. Additionally, you can define the amount of the overdue fine and the text modules to be used in the dunning notice for each dunning level individually.`}</label>
                        </div>
                    </div>
                </div>

                {
                    dunningData.map((data, idx) => (
                        <div key={idx}>
                            {/* Propose creation*/}
                            <div className="columns is-multiline m-b-5 no-margin-left no-margin-right m-b-15">
                                <div className="column is-8">
                                    <div className="field">
                                        <div className="title is-5 no-margin-bottom">{`Activate dunning level for ${idx == 0 ? 'Payment' : idx} Payment reminder`}</div>
                                    </div>
                                </div>
                                <div className="column is-4">
                                    <div className="field">
                                        <div className="is-12 m-l-100">
                                            <Switch
                                                onChange={(e) => handleToggle(idx, e)}
                                                checked={data.active}
                                                isSuccess
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="column is-4">
                                    <div className="field">
                                    </div>
                                </div> */}
                                <div className="column is-4">
                                    <div className="field">
                                        <h3 className="title is-5 is-thin">Propose creation</h3>
                                    </div>
                                </div>
                                <div className="column is-4">
                                    <div className="field">
                                        <InputAddons
                                            type="number"
                                            name="proposeCreation"
                                            placeholder=""
                                            value={data.daysTillAlert}
                                            // value={newNumberRange.startFrom}
                                            onChange={(e) => handleInputChange(idx, 'daysTillAlert', Number(e.target.value))}
                                        />
                                        {/* <ErrorText
                                visible={error.prefix}
                                text={error.prefix}
                            /> */}

                                    </div>
                                </div>
                                <div className="column is-4">
                                    <div className="field">
                                        <h3 className="title is-6 is-thin m-l-100">{`days after due date`}</h3>
                                        {/* <ErrorText
                                visible={error.prefix}
                                text={error.prefix}
                            /> */}

                                    </div>
                                </div>
                            </div>

                            {/* Overdue fines*/}
                            <div className="columns is-multiline m-b-5 no-margin-left no-margin-right m-b-15">
                                <div className="column is-4">
                                    <div className="field">
                                        <h3 className="title is-5 is-thin">Overdue fines</h3>
                                    </div>
                                </div>
                                <div className="column is-4">
                                    <div className="field">
                                        <InputAddons
                                            type="number"
                                            name="overDuesFines"
                                            placeholder=""
                                            onChange={(e) => handleInputChange(idx, 'charge', Number(e.target.value))}
                                            value={data.charge}
                                        />
                                        {/* <ErrorText
                                visible={error.prefix}
                                text={error.prefix}
                            /> */}

                                    </div>
                                </div>
                            </div>
                            {openModuleIndex === idx && (
                                <>
                                    <div className="column is-12">
                                        <div className="field">
                                            <label>Introduction text</label>
                                            <HtmlInputComponent
                                                name='introductionText'
                                                className={"textarea text-module-input"}
                                                value={data.introduction}
                                                onChange={(e) => handleInputChange(idx, 'introduction', e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="column is-12">
                                        <div className="field">
                                            <label>Closing text</label>
                                            <HtmlInputComponent
                                                name='introductionText'
                                                className={"textarea text-module-input"}
                                                value={data.conclusion}
                                                onChange={(e) => handleInputChange(idx, 'conclusion', e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="column is-12 ">
                                        <div className="field">
                                            <label>Email dispatch</label>
                                            <HtmlInputComponent
                                                name='introductionText'
                                                className={"textarea text-module-input"}
                                                value={data.email}
                                                onChange={(e) => handleInputChange(idx, 'email', e)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                            }
                            {/* show text module*/}
                            <div className="columns is-multiline m-b-5 no-margin-left no-margin-right m-b-15">
                                <div className="column is-4">
                                    <div className="field">
                                        {/* <h3 className="title is-5 is-thin">Overdue fines</h3> */}
                                    </div>
                                </div>
                                <div className="column is-4">
                                    <div className="field">

                                    </div>
                                </div>
                                <div className="column is-4">
                                    <div className="field">
                                        <h3 className="title is-6 is-thin m-l-100" style={{ color: '#0071ca', cursor: 'pointer' }} onClick={() => handleToggleModule(idx)}>{openModuleIndex === idx ? `Hide text modules` : `Show text modules`}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </Modal>
        </div>
    );
};

export default DunningModal;
