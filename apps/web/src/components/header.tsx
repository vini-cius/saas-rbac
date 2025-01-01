import Image from 'next/image'

import rockstarGamesIcon from '@/assets/rockstar-games-icon.svg'

import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={rockstarGamesIcon}
          className="size-6 dark:invert"
          alt="Rockstar Games"
        />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}