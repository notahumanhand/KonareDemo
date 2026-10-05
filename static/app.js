/* --------------------------------------------------
   CaseFlow
   Document folder interaction
   -------------------------------------------------- */


const caseDemo = document.querySelector(".page-container");

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


if (
    caseDemo &&
    documentList &&
    documentListCount &&
    caseDocumentCount &&
    selectedDocumentTitle &&
    documentViewer
) {

    const caseId = caseDemo.dataset.caseId;


    if (caseId) {
        loadDocuments();
    }


    async function loadDocuments() {

        try {

            const response = await fetch(
                `/api/cases/${encodeURIComponent(caseId)}/documents`
            );


            if (!response.ok) {
                throw new Error(
                    "Unable to load case documents."
                );
            }


            const documents = await response.json();


            documentListCount.textContent = documents.length;
            caseDocumentCount.textContent = documents.length;


            if (documents.length === 0) {
                showDocumentListMessage(
                    "No documents are available for this case."
                );

                return;
            }


            renderDocumentList(documents);

            selectDocument(documents[0]);

        } catch (error) {

            console.error(error);

            documentListCount.textContent = "0";
            caseDocumentCount.textContent = "0";

            showDocumentListMessage(
                "Unable to load the demonstration documents."
            );

            showViewerError();

        }

    }


    function renderDocumentList(documents) {

        documentList.replaceChildren();


        documents.forEach((document) => {

            const button =
                document.createElement("button");


            button.type = "button";
            button.className = "document-item";


            button.dataset.documentId =
                document.id;


            const documentNumber =
                document.createElement("span");

            documentNumber.className =
                "document-number";

            documentNumber.textContent =
                document.id;


            const documentInformation =
                document.createElement("span");

            documentInformation.className =
                "document-information";


            const documentName =
                document.createElement("strong");

            documentName.textContent =
                document.name;


            const documentCategory =
                document.createElement("small");

            documentCategory.textContent =
                document.category;


            documentInformation.appendChild(
                documentName
            );

            documentInformation.appendChild(
                documentCategory
            );


            button.appendChild(
                documentNumber
            );

            button.appendChild(
                documentInformation
            );


            button.addEventListener(
                "click",
                () => selectDocument(document)
            );


            documentList.appendChild(button);

        });

    }


    async function selectDocument(document) {

        setSelectedDocument(document.id);

        selectedDocumentTitle.textContent =
            document.name;


        showViewerLoading(document.name);


        try {

            const response = await fetch(
                `/api/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(document.id)}`
            );


            if (!response.ok) {
                throw new Error(
                    "Unable to load the selected document."
                );
            }


            const documentData =
                await response.json();


            renderDocument(documentData);

        } catch (error) {

            console.error(error);

            showViewerError();

        }

    }


    function setSelectedDocument(documentId) {

        const documentItems =
            document.querySelectorAll(".document-item");


        documentItems.forEach((item) => {

            item.classList.toggle(
                "selected",
                item.dataset.documentId === documentId
            );

        });

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


        documentViewer.appendChild(label);
        documentViewer.appendChild(heading);
        documentViewer.appendChild(message);

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


        documentViewer.appendChild(label);
        documentViewer.appendChild(heading);


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


        documentViewer.appendChild(label);
        documentViewer.appendChild(heading);
        documentViewer.appendChild(message);

    }

}