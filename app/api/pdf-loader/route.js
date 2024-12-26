import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl = "https://flippant-lemming-277.convex.cloud/api/storage/6b4daa5f-34ea-4669-a16a-2d349696b280"

export async function GET(req) {

    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const pdfUrl = searchParams.get("pdfUrl");

    // 1. Load PDF File
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = "";
    docs.forEach(doc => {
        pdfTextContent = pdfTextContent + doc.pageContent;
    });

    // 2. Split text into smaller chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];
    output.forEach(doc => {
        splitterList.push(doc.pageContent);
    })


    return NextResponse.json({ result: splitterList })
}