import { ExternalLinkIcon } from '@heroicons/react/outline';

const CollectionLink: React.FC  = () => {
  return (
      <div className="mt-8 mb-4 text-center">
          <a
            href="https://sigma.explorer.laosnetwork.io/address/0xFfFFFFFFFfffFFfFFffFffFE00000000000000d1?tab=txs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center justify-center"
          >
            View the HBD Collection here
            <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
  )
}

export default CollectionLink
