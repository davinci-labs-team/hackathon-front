import exampleImg from '@/assets/images/example.jpg'
import epitaLogo from '@/assets/images/epita.png'
import { Announcement } from '@/types/announcement'

const getPastDate = (ms: number): string => {
  return new Date(Date.now() - ms).toISOString()
}

export const announcements: Announcement[] = [
  {
    title: 'Nouvelle Édition !',
    author: 'Paul Martin',
    date: getPastDate(30 * 1000), // 30 secondes
    tags: ['2025', 'Public'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id pharetra sem. Donec ut congue mauris, ut varius quam. Morbi eu nisl eu dolor elementum dapibus eu ac dolor. Mauris ultrices quis est at consequat. In hendrerit massa eu lorem mollis, sed malesuada nisi fermentum. Vivamus luctus euismod mi, in pulvinar ligula. In hac habitasse platea dictumst. Donec interdum nulla ac neque eleifend mattis. Suspendisse elementum est vel aliquet viverra.',
  },
  {
    title: "Cérémonie d'ouverture",
    author: 'Paul Martin',
    date: getPastDate(5 * 60 * 1000), // 5 minutes
    tags: ['2025'],
    description:
      'Sed pellentesque lacus in ullamcorper bibendum. Vestibulum sit amet ipsum semper lacus pharetra vulputate. Ut sed aliquam dui, ut ornare nisl. Vivamus pretium ligula in diam bibendum tincidunt ut eget quam.',
  },
  {
    title: 'Ouverture des inscriptions',
    author: 'Sarah Leblanc',
    date: getPastDate(3 * 60 * 60 * 1000), // 3 heures
    tags: ['2025'],
    description:
      'Donec quam ligula, molestie ut vulputate nec, tincidunt nec tortor. Aliquam consequat eu mi sed cursus. Duis porttitor lorem vitae risus tincidunt sagittis. Nulla efficitur urna vel lacus fermentum, quis congue mi varius. Vivamus fringilla laoreet odio quis feugiat. Donec et massa suscipit, porttitor mi a, posuere erat.',
  },
  {
    title: 'Nos partenaires',
    author: 'Paul Martin',
    date: getPastDate(2 * 24 * 60 * 60 * 1000), // 2 jours
    tags: ['2025', 'Sponsors'],
    description:
      'Etiam commodo molestie erat, quis sodales urna egestas non. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque vitae nisi rutrum, efficitur tortor sed, tincidunt lectus. Ut non metus eu nisi tempus pretium. Curabitur vestibulum sapien ut mauris pretium, sed porta risus vehicula.',
    images: [exampleImg, epitaLogo],
  },
  {
    title: 'Annonce spéciale 1',
    author: 'Jean Dupont',
    date: getPastDate(3 * 7 * 24 * 60 * 60 * 1000), // 3 semaines
    tags: ['2025', 'Infos'],
    description:
      'Donec sollicitudin vestibulum sagittis. Curabitur sit amet faucibus tellus, vel vestibulum magna. Sed in tortor erat. Morbi bibendum purus vitae lacus faucibus cursus. Integer pellentesque quis metus in porta. Donec pharetra ultrices auctor.',
  },
  {
    title: 'Annonce spéciale 2',
    author: 'Marie Curie',
    date: getPastDate(5 * 7 * 24 * 60 * 60 * 1000), // 5 semaines
    tags: ['2025'],
    description:
      'Suspendisse eu orci sed elit scelerisque pharetra et ut metus. Sed consequat tortor felis, sit amet egestas felis dignissim vitae. Sed consectetur eu ligula sit amet pulvinar. Nulla facilisis turpis a lacus posuere luctus.',
  },
  {
    title: 'Annonce spéciale 3',
    author: 'Paul Martin',
    date: getPastDate(6 * 7 * 24 * 60 * 60 * 1000), // 6 semaines
    tags: ['2025', 'Événement'],
    description:
      'Morbi pretium luctus mattis. Integer tristique orci ut velit elementum egestas. Aliquam aliquam sit amet est in accumsan. Nam pretium quis felis ac rutrum. Vestibulum ut risus arcu. Mauris semper purus eu malesuada pellentesque. Integer non euismod quam. Sed sit amet massa lectus. Integer vehicula bibendum sapien eu vestibulum.',
  },
  {
    title: 'Annonce spéciale 4',
    author: 'Sarah Leblanc',
    date: getPastDate(8 * 7 * 24 * 60 * 60 * 1000), // 8 semaines
    tags: ['2025', 'Partenaires'],
    description:
      'Duis eget bibendum quam, at porttitor lectus. Fusce at ipsum sed lectus mollis facilisis vel in enim. Curabitur cursus, arcu et viverra porttitor, elit libero mattis augue, at lobortis erat tellus sit amet orci. Ut venenatis eleifend dui at dignissim.',
  },
]
