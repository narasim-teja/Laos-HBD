

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
console.log(PINATA_JWT)

export async function uploadMetadataToIPFS(data: {
  name: string;
  message: string;
  image: File;
}) {
  try {
    const { name, message, image } = data;

    // Upload the image to IPFS
    const imageFormData = new FormData();
    imageFormData.append('file', image);

    const imageUploadResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: imageFormData,
    });

    const imageResult = await imageUploadResponse.json();

    if (!imageResult.IpfsHash) {
      throw new Error('Failed to upload image to IPFS');
    }

    // Prepare metadata
    const metadata = {
      name,
      description: message,
      image: `ipfs://${imageResult.IpfsHash}`,
    };

    // Upload metadata to IPFS
    const metadataUploadResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    const metadataResult = await metadataUploadResponse.json();

    if (!metadataResult.IpfsHash) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    // Return the IPFS URL of the metadata JSON
    return `ipfs://${metadataResult.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}
