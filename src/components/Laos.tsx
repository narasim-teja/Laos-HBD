import { ExternalLinkIcon } from '@heroicons/react/outline';

const Laos: React.FC  = () => {
  return (
      <div className="mt-8 mb-4 text-center">
          <a
            href="https://laosnetwork.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center justify-center"
          >
            More about Laos Network here
            <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
  )
}

export default Laos
