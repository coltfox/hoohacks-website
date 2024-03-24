import Box from '@mui/material/Box';

interface StatusLabelProps {
    label: string
    value: string
    valueColor: string
}

export default function StatusLabel(props: StatusLabelProps) {
    return (
        <div>
            <span className="mr-1">{props.label}:</span>
            <span style={{color: props.valueColor}}>{props.value}</span>
        </div>
    )
}