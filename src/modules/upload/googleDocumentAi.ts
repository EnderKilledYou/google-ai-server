const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1beta3;

const os = import("os");

const client = new DocumentProcessorServiceClient();

async function getProjectId() {
  return await this.client.getProjectId();
}

/**
 *
 * @param processorId The full resource name of the processor, e.g.: projects/project-id/locations/location/processor/processor-id  / You must create new processors in the Cloud Console first
 * @param encodedImage base 64 encoded image
 * @param location
 */
export async function ProcessDocument(processorId: string, encodedImage: string, location: string = "us") {
  const items = encodedImage.split(",");

  let meta;
  let data;
  if (items.length > 1) {
    const metaarray = items[0].split(":");
    if (metaarray.length < 1) {
      meta = "image/png";
    } else {
      meta = metaarray[1].split(";")[0];
    }
    data = items[1];
  } else {
    meta = "image/png";
    data = items[1];
  }
  const projectId = await client.getProjectId();
  console.log(projectId);
  let name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const request = {
    name: name,
    rawDocument: {
      content: data,
      mimeType: meta
    }
  };

  // Recognizes text entities in the PDF document
  const [result] = await client.processDocument(request);
  const { document } = result;


  const { text } = document;

  // Extract shards from the text field
  const getText = textAnchor => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };


  console.log("The document contains the following paragraphs:");
  for (const page of document.pages) {
    for (const key of Object.keys(page)) {
      const paragraphs = page[key];
      if (paragraphs && Array.isArray(paragraphs) )
        for (const paragraph of paragraphs) {
          if(Object.keys(paragraph).indexOf("layout") > 0)
            paragraph.text = getText(paragraph.layout.textAnchor);

        }
    }
  }
  const output = {};
  Object.keys(document).forEach(page => {
    let element = document[page];
    if (page == "tokens") return;
    if (!Array.isArray(element))
      output[page] = element;
    else
      output[page] = element.map(a => {
        const out_ = {};
        for (const item of Object.keys(a)) {
          if (item == "tokens") continue;
          if (!Array.isArray(a[item])) {
            out_[item] = a[item];
            continue;
          }
          if (a[item].length > 0 && "layout" in a[item][0]) {
            for (const item of Object.keys(a)) {
              if ("image" in a) {
                a["image"] = null;

              }
            }
            out_[item] = a[item];
          }
        }
        return a;
      });
  });
  return {
    text: text,
    data: output
  };
}

