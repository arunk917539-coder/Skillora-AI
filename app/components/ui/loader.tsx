import React from 'react'

const Loader = () => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50">
            <div className="common-loader h-20 w-20"></div>
        </div>
    )
}

export default Loader