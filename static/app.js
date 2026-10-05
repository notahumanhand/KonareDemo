/* --------------------------------------------------
   CaseFlow
   Document folder interaction
   -------------------------------------------------- */


const caseDemo =
    document.querySelector(".page-container");

const documentList =
    document.querySelector("#document-list");

const documentListCount =
    document.querySelector("#document-list-count");

const caseDocumentCount =
    document.querySelector("#case-document-count");

const selectedDocumentTitle =
    document.querySelector("#selected-document-title");

const documentViewer =
    document.querySelector("#document-viewer");

const selectedDocumentCount =
    document.querySelector("#selected-document-count");

const selectAllDocumentsButton =
    document.querySelector("#select-all-documents");

const clearSelectedDocumentsButton =
    document.querySelector("#clear-selected-documents");

const analyzeDocumentsButton =
    document.querySelector("#analyze-documents");

const analysisButtonNote =
    document.querySelector("#analysis-button-note");

const analysisStatus =
    document.querySelector("#analysis-status");

const analysisResults =
    document.querySelector("#analysis-results");

const analysisOverallStatus =
    document.querySelector("#analysis-overall-status");

const analysisSummary =
    document.querySelector("#analysis-summary");

const keyFactsCount =
    document.querySelector("#key-facts-count");

const keyFactsList =
    document.querySelector("#key-facts-list");

const findingsCount =
    document.querySelector("#findings-count");

const findingsList =
    document.querySelector("#findings-list");


if (
    caseDemo &&
    documentList &&
    documentListCount &&
    caseDocumentCount &&
    selectedDocumentTitle &&
    documentViewer &&
    selectedDocumentCount &&
    selectAllDocumentsButton &&
    clearSelectedDocumentsButton &&
    analyzeDocumentsButton &&
    analysisButtonNote &&
    analysisStatus &&
    analysisResults &&
    analysisOverallStatus &&
    analysisSummary &&
    keyFactsCount &&
    keyFactsList &&
    findingsCount &&
    findingsList
) {

    const caseId =
        caseDemo.dataset.caseId;


    let caseDocuments = [];


    if (caseId) {
        loadDocuments();
    }


    async function loadDocuments() {

        try {

            const response =
                await fetch(
                    `/api/cases/${encodeURIComponent(caseId)}/documents`
                );


            if (!response.ok) {
                throw new Error(
                    "Unable to load case documents."
                );
            }


            const documents =
                await response.json();


            caseDocuments =
                documents;


            documentListCount.textContent =
                documents.length;

            caseDocumentCount.textContent =
                documents.length;


            if (documents.length === 0) {

                showDocumentListMessage(
                    "No documents are available for this case."
                );

                updateSelectionState();

                return;
            }


            renderDocumentList(documents);

            selectDocument(documents[0]);

            updateSelectionState();

        } catch (error) {

            console.error(error);

            documentListCount.textContent =
                "0";

            caseDocumentCount.textContent =
                "0";

            showDocumentListMessage(
                "Unable to load the demonstration documents."
            );

            showViewerError();

            updateSelectionState();

        }

    }


    function renderDocumentList(documents) {

        documentList.replaceChildren();


        documents.forEach((documentData) => {

            const documentItem =
                document.createElement("div");


            documentItem.className =
                "document-item";


            documentItem.dataset.documentId =
                documentData.id;


            const checkboxContainer =
                document.createElement("label");


            checkboxContainer.className =
                "document-checkbox";


            checkboxContainer.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();
                }
            );


            const checkbox =
                document.createElement("input");


            checkbox.type =
                "checkbox";

            checkbox.name =
                "case-document";

            checkbox.value =
                documentData.id;

            checkbox.setAttribute(
                "aria-label",
                `Select ${documentData.name}`
            );


            checkbox.addEventListener(
                "change",
                updateSelectionState
            );


            const documentNumber =
                document.createElement("span");

            documentNumber.className =
                "document-number";

            documentNumber.textContent =
                documentData.id;


            const documentInformation =
                document.createElement("span");

            documentInformation.className =
                "document-information";


            const documentName =
                document.createElement("strong");

            documentName.textContent =
                documentData.name;


            const documentCategory =
                document.createElement("small");

            documentCategory.textContent =
                documentData.category;


            documentInformation.appendChild(
                documentName
            );

            documentInformation.appendChild(
                documentCategory
            );


            checkboxContainer.appendChild(
                checkbox
            );


            documentItem.appendChild(
                checkboxContainer
            );

            documentItem.appendChild(
                documentNumber
            );

            documentItem.appendChild(
                documentInformation
            );


            documentItem.addEventListener(
                "click",
                () => selectDocument(documentData)
            );


            documentList.appendChild(
                documentItem
            );

        });

    }


    async function selectDocument(documentData) {

        setSelectedDocument(
            documentData.id
        );


        selectedDocumentTitle.textContent =
            documentData.name;


        showViewerLoading(
            documentData.name
        );


        try {

            const response =
                await fetch(
                    `/api/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(documentData.id)}`
                );


            if (!response.ok) {
                throw new Error(
                    "Unable to load the selected document."
                );
            }


            const selectedDocument =
                await response.json();


            renderDocument(
                selectedDocument
            );

        } catch (error) {

            console.error(error);

            showViewerError();

        }

    }


    function setSelectedDocument(documentId) {

        const documentItems =
            document.querySelectorAll(
                ".document-item"
            );


        documentItems.forEach((item) => {

            item.classList.toggle(
                "selected",
                item.dataset.documentId === documentId
            );

        });

    }


    function getSelectedDocumentIds() {

        const selectedCheckboxes =
            document.querySelectorAll(
                'input[name="case-document"]:checked'
            );


        return Array.from(
            selectedCheckboxes
        ).map(
            (checkbox) => checkbox.value
        );

    }


    function updateSelectionState() {

        const selectedIds =
            getSelectedDocumentIds();


        selectedDocumentCount.textContent =
            selectedIds.length;


        analyzeDocumentsButton.disabled =
            selectedIds.length === 0;


        if (selectedIds.length === 0) {

            analysisButtonNote.textContent =
                "Select at least one document to begin analysis.";

        } else {

            analysisButtonNote.textContent =
                `${selectedIds.length} document${
                    selectedIds.length === 1
                        ? ""
                        : "s"
                } selected for analysis.`;

        }


        const allDocumentsSelected =
            caseDocuments.length > 0 &&
            selectedIds.length === caseDocuments.length;


        selectAllDocumentsButton.disabled =
            allDocumentsSelected;


        clearSelectedDocumentsButton.disabled =
            selectedIds.length === 0;

    }


    function selectAllDocuments() {

        const checkboxes =
            document.querySelectorAll(
                'input[name="case-document"]'
            );


        checkboxes.forEach((checkbox) => {

            checkbox.checked =
                true;

        });


        updateSelectionState();

    }


    function clearSelectedDocuments() {

        const checkboxes =
            document.querySelectorAll(
                'input[name="case-document"]'
            );


        checkboxes.forEach((checkbox) => {

            checkbox.checked =
                false;

        });


        updateSelectionState();

    }


    selectAllDocumentsButton.addEventListener(
        "click",
        selectAllDocuments
    );


    clearSelectedDocumentsButton.addEventListener(
        "click",
        clearSelectedDocuments
    );


    analyzeDocumentsButton.addEventListener(
        "click",
        analyzeSelectedDocuments
    );


    async function analyzeSelectedDocuments() {

        const selectedIds =
            getSelectedDocumentIds();


        if (selectedIds.length === 0) {

            analysisButtonNote.textContent =
                "Select at least one document to begin analysis.";

            return;

        }


        analysisResults.hidden =
            true;


        analysisStatus.hidden =
            false;

        analysisStatus.className =
            "analysis-status analysis-status-processing";

        analysisStatus.replaceChildren();


        const processingHeading =
            document.createElement("strong");

        processingHeading.textContent =
            "Case analysis in progress";


        const processingMessage =
            document.createElement("span");

        processingMessage.textContent =
            "The selected documents are being reviewed.";


        analysisStatus.appendChild(
            processingHeading
        );

        analysisStatus.appendChild(
            processingMessage
        );


        analyzeDocumentsButton.disabled =
            true;


        analyzeDocumentsButton.textContent =
            "Analyzing...";


        analysisButtonNote.textContent =
            `Analyzing ${selectedIds.length} selected document${
                selectedIds.length === 1
                    ? ""
                    : "s"
            }...`;


        try {

            const response =
                await fetch(
                    `/api/cases/${encodeURIComponent(caseId)}/analyze`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            document_ids:
                                selectedIds
                        })
                    }
                );


            let responseData = null;


            try {

                responseData =
                    await response.json();

            } catch (error) {

                throw new Error(
                    "The analysis service returned an invalid response."
                );

            }


            if (!response.ok) {

                throw new Error(
                    responseData.detail ||
                    "Unable to analyze the selected documents."
                );

            }


            renderAnalysisResults(
                responseData
            );


            analysisStatus.className =
                "analysis-status analysis-status-complete";

            analysisStatus.replaceChildren();


            const completedHeading =
                document.createElement("strong");

            completedHeading.textContent =
                "Case analysis completed";


            const completedMessage =
                document.createElement("span");

            completedMessage.textContent =
                "The selected documents have been processed successfully.";


            analysisStatus.appendChild(
                completedHeading
            );

            analysisStatus.appendChild(
                completedMessage
            );


            analysisResults.hidden =
                false;


            analysisButtonNote.textContent =
                "Analysis completed successfully.";

        } catch (error) {

            console.error(
                "Case analysis failed:",
                error
            );


            analysisStatus.className =
                "analysis-status analysis-status-error";

            analysisStatus.replaceChildren();


            const errorHeading =
                document.createElement("strong");

            errorHeading.textContent =
                "Case analysis could not be completed";


            const errorMessage =
                document.createElement("span");

            errorMessage.textContent =
                error.message ||
                "Unable to analyze the selected documents.";


            analysisStatus.appendChild(
                errorHeading
            );

            analysisStatus.appendChild(
                errorMessage
            );


            analysisResults.hidden =
                true;


            analysisButtonNote.textContent =
                "The analysis request could not be completed.";

        } finally {

            analyzeDocumentsButton.textContent =
                "Analyze Selected Documents";


            updateSelectionState();

        }

    }


    function renderAnalysisResults(review) {

        analysisOverallStatus.textContent =
            review.overall_review_status ||
            "Review status unavailable";


        analysisOverallStatus.className =
            "status status-analysis";


        analysisSummary.textContent =
            review.case_summary ||
            "No case summary was returned.";


        renderKeyFacts(
            review.key_facts
        );


        renderFindings(
            review.findings
        );

    }


    function renderKeyFacts(keyFacts) {

        keyFactsList.replaceChildren();


        const facts =
            Array.isArray(keyFacts)
                ? keyFacts
                : [];


        keyFactsCount.textContent =
            `${facts.length} ${
                facts.length === 1
                    ? "fact"
                    : "facts"
            }`;


        if (facts.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "analysis-empty-message";

            emptyMessage.textContent =
                "No key facts were returned for this review.";


            keyFactsList.appendChild(
                emptyMessage
            );

            return;

        }


        facts.forEach((fact) => {

            const factRow =
                document.createElement("div");

            factRow.className =
                "key-fact-row";


            const factInformation =
                document.createElement("div");

            factInformation.className =
                "key-fact-information";


            const factField =
                document.createElement("strong");

            factField.textContent =
                fact.field ||
                "Unspecified field";


            const factValue =
                document.createElement("span");

            factValue.textContent =
                fact.value ||
                "No value returned";


            factInformation.appendChild(
                factField
            );

            factInformation.appendChild(
                factValue
            );


            const sourceList =
                createSourceList(
                    fact.sources
                );


            factRow.appendChild(
                factInformation
            );

            factRow.appendChild(
                sourceList
            );


            keyFactsList.appendChild(
                factRow
            );

        });

    }


    function renderFindings(findings) {

        findingsList.replaceChildren();


        const findingItems =
            Array.isArray(findings)
                ? findings
                : [];


        findingsCount.textContent =
            `${findingItems.length} ${
                findingItems.length === 1
                    ? "finding"
                    : "findings"
            }`;


        if (findingItems.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "analysis-empty-message";

            emptyMessage.textContent =
                "No findings were returned for this review.";


            findingsList.appendChild(
                emptyMessage
            );

            return;

        }


        findingItems.forEach((finding) => {

            const findingCard =
                document.createElement("article");

            findingCard.className =
                "finding-card";


            const findingHeader =
                document.createElement("div");

            findingHeader.className =
                "finding-header";


            const findingHeading =
                document.createElement("div");

            findingHeading.className =
                "finding-heading";


            const severity =
                document.createElement("span");

            severity.className =
                `finding-severity finding-severity-${
                    finding.severity ||
                    "medium"
                }`;

            severity.textContent =
                formatFindingSeverity(
                    finding.severity
                );


            const title =
                document.createElement("h5");

            title.textContent =
                finding.title ||
                "Untitled finding";


            findingHeading.appendChild(
                severity
            );

            findingHeading.appendChild(
                title
            );


            const findingType =
                document.createElement("span");

            findingType.className =
                "finding-type";

            findingType.textContent =
                formatFindingType(
                    finding.type
                );


            findingHeader.appendChild(
                findingHeading
            );

            findingHeader.appendChild(
                findingType
            );


            const summary =
                document.createElement("p");

            summary.className =
                "finding-summary";

            summary.textContent =
                finding.summary ||
                "No finding summary was returned.";


            const sourceHeading =
                document.createElement("p");

            sourceHeading.className =
                "finding-subheading";

            sourceHeading.textContent =
                "Source documents";


            const sourceList =
                createSourceList(
                    finding.sources
                );


            const recommendationHeading =
                document.createElement("p");

            recommendationHeading.className =
                "finding-subheading";

            recommendationHeading.textContent =
                "Human review recommendation";


            const recommendation =
                document.createElement("p");

            recommendation.className =
                "finding-recommendation";

            recommendation.textContent =
                finding.review_recommendation ||
                "No review recommendation was returned.";


            findingCard.appendChild(
                findingHeader
            );

            findingCard.appendChild(
                summary
            );

            findingCard.appendChild(
                sourceHeading
            );

            findingCard.appendChild(
                sourceList
            );

            findingCard.appendChild(
                recommendationHeading
            );

            findingCard.appendChild(
                recommendation
            );


            findingsList.appendChild(
                findingCard
            );

        });

    }


    function createSourceList(sources) {

        const sourceContainer =
            document.createElement("div");

        sourceContainer.className =
            "source-list";


        const sourceItems =
            Array.isArray(sources)
                ? sources
                : [];


        if (sourceItems.length === 0) {

            const noSource =
                document.createElement("span");

            noSource.className =
                "source-empty";

            noSource.textContent =
                "No source documents returned.";


            sourceContainer.appendChild(
                noSource
            );

            return sourceContainer;

        }


        sourceItems.forEach((source) => {

            const sourceItem =
                document.createElement("span");

            sourceItem.className =
                "source-item";


            sourceItem.textContent =
                source.document_id ||
                "Unknown";


            sourceItem.title =
                source.value ||
                "";


            sourceContainer.appendChild(
                sourceItem
            );

        });


        return sourceContainer;

    }


    function formatFindingSeverity(severity) {

        if (!severity) {
            return "Unknown";
        }


        return severity
            .charAt(0)
            .toUpperCase() +
            severity.slice(1);

    }


    function formatFindingType(type) {

        if (!type) {
            return "Unspecified";
        }


        return type
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");

    }


    function showViewerLoading(documentName) {

        documentViewer.replaceChildren();


        const label =
            document.createElement("p");

        label.className =
            "section-label";

        label.textContent =
            "DOCUMENT PREVIEW";


        const heading =
            document.createElement("h3");

        heading.textContent =
            documentName;


        const message =
            document.createElement("p");

        message.textContent =
            "Loading document information...";


        documentViewer.appendChild(
            label
        );

        documentViewer.appendChild(
            heading
        );

        documentViewer.appendChild(
            message
        );

    }


    function renderDocument(documentData) {

        documentViewer.replaceChildren();


        const label =
            document.createElement("p");

        label.className =
            "section-label";

        label.textContent =
            "DOCUMENT PREVIEW";


        const heading =
            document.createElement("h3");

        heading.textContent =
            documentData.name;


        documentViewer.appendChild(
            label
        );

        documentViewer.appendChild(
            heading
        );


        if (
            documentData.fields &&
            documentData.fields.length > 0
        ) {

            const informationLabel =
                document.createElement("p");

            informationLabel.className =
                "section-label";

            informationLabel.textContent =
                "DOCUMENT INFORMATION";


            documentViewer.appendChild(
                informationLabel
            );


            const fieldList =
                document.createElement("div");


            documentData.fields.forEach((field) => {

                const fieldContainer =
                    document.createElement("p");


                const fieldLabel =
                    document.createElement("strong");

                fieldLabel.textContent =
                    `${field.label}: `;


                const fieldValue =
                    document.createElement("span");

                fieldValue.textContent =
                    field.value;


                fieldContainer.appendChild(
                    fieldLabel
                );

                fieldContainer.appendChild(
                    fieldValue
                );


                fieldList.appendChild(
                    fieldContainer
                );

            });


            documentViewer.appendChild(
                fieldList
            );

        }


        if (
            documentData.paragraphs &&
            documentData.paragraphs.length > 0
        ) {

            const paragraphLabel =
                document.createElement("p");

            paragraphLabel.className =
                "section-label";

            paragraphLabel.textContent =
                "DOCUMENT NOTES";


            documentViewer.appendChild(
                paragraphLabel
            );


            documentData.paragraphs.forEach(
                (paragraph) => {

                    const paragraphElement =
                        document.createElement("p");

                    paragraphElement.textContent =
                        paragraph;


                    documentViewer.appendChild(
                        paragraphElement
                    );

                }
            );

        }

    }


    function showDocumentListMessage(message) {

        documentList.replaceChildren();


        const messageElement =
            document.createElement("p");

        messageElement.textContent =
            message;


        documentList.appendChild(
            messageElement
        );

    }


    function showViewerError() {

        documentViewer.replaceChildren();


        const label =
            document.createElement("p");

        label.className =
            "section-label";

        label.textContent =
            "DOCUMENT PREVIEW";


        const heading =
            document.createElement("h3");

        heading.textContent =
            "Unable to load document";


        const message =
            document.createElement("p");

        message.textContent =
            "The demonstration document could not be retrieved. Check the application server and try again.";


        documentViewer.appendChild(
            label
        );

        documentViewer.appendChild(
            heading
        );

        documentViewer.appendChild(
            message
        );

    }

}