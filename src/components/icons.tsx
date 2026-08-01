type IconProps = {
  className?: string
}

function createIcon(path: string, viewBox = '0 0 24 24') {
  return function Icon({ className }: IconProps) {
    return (
      <svg className={className} viewBox={viewBox} fill="none" aria-hidden="true">
        <path d={path} />
      </svg>
    )
  }
}

export const Users = createIcon(
  'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6.5 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M14 20a5.5 5.5 0 0 1 8.5-4.6',
)

export const UserCog = createIcon(
  'M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-1 2c-4 0-7 2.5-7 6m18.5-2.5.8-.5-.4-1.1-1 .1a4.5 4.5 0 0 0-.8-1.3l.3-1-1-.5-.8.6a4.5 4.5 0 0 0-1.5-.4l-.3-1h-1.2l-.3 1a4.5 4.5 0 0 0-1.5.4l-.8-.6-1 .5.3 1c-.4.4-.7.8-.9 1.3l-1-.1-.4 1.1.8.5c0 .4 0 .8.1 1.2l-.8.5.4 1.1 1-.1c.2.5.5.9.9 1.3l-.3 1 1 .5.8-.6c.5.2 1 .4 1.5.4l.3 1h1.2l.3-1c.5 0 1-.2 1.5-.4l.8.6 1-.5-.3-1c.4-.4.7-.8.9-1.3l1 .1.4-1.1-.8-.5c.1-.4.1-.8.1-1.2Zm-4.5 3a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
)

export const ShieldCheck = createIcon(
  'M12 3 5 6v5c0 4.9 3.4 9.2 7 10 3.6-.8 7-5.1 7-10V6l-7-3Zm-1 11 5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3Z',
)
