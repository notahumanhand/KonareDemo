from enum import Enum

from pydantic import BaseModel, ConfigDict


class FindingType(str, Enum):
    DISCREPANCY = "discrepancy"
    IDENTITY_VARIATION = "identity_variation"
    ADDRESS_VARIATION = "address_variation"
    MISSING_INFORMATION = "missing_information"
    SECURITY_EVENT = "security_event"


class FindingSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class DocumentID(str, Enum):
    DOCUMENT_01 = "01"
    DOCUMENT_02 = "02"
    DOCUMENT_03 = "03"
    DOCUMENT_04 = "04"
    DOCUMENT_05 = "05"
    DOCUMENT_06 = "06"
    DOCUMENT_07 = "07"
    DOCUMENT_08 = "08"
    DOCUMENT_09 = "09"
    DOCUMENT_10 = "10"
    DOCUMENT_11 = "11"
    DOCUMENT_12 = "12"


class FindingSource(BaseModel):
    model_config = ConfigDict(extra="forbid")

    document_id: DocumentID
    document_name: str
    value: str


class Finding(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: FindingType
    severity: FindingSeverity
    title: str
    summary: str
    sources: list[FindingSource]
    review_recommendation: str


class KeyFact(BaseModel):
    model_config = ConfigDict(extra="forbid")

    field: str
    value: str
    sources: list[FindingSource]


class CaseReview(BaseModel):
    model_config = ConfigDict(extra="forbid")

    case_summary: str
    key_facts: list[KeyFact]
    findings: list[Finding]
    overall_review_status: str