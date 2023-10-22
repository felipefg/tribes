import Image from 'next/image';
import Link from 'next/link';
import gradient1 from '@/assets/gradient1.svg'
import gradient2 from '@/assets/gradient2.svg'
import gradient3 from '@/assets/gradient3.svg'

export default function Home() {
  
  return (
    <div className='w-full'>
      <div className='relative'>
        <div className='flex justify-center items-center py-16 z-10'>
          <div className='flex flex-col relative z-10'>
            <h1 className='font-medium text-6xl py-2'>Empower your community,</h1>
            <h1 className='font-medium text-6xl py-2'>Empower your tribe!</h1>
            <div className='flex justify-center pt-12 z-10'>
              <p className='font-medium text-xl z-10'>The web3 creator's economy enabler: building true communities</p>
            </div>
          </div>
        </div>
        <Image draggable={false} className='absolute right-0 top-10 z-0' width={500} src={gradient1} />
        <Image draggable={false} className='absolute left-0 top-20 z-0' width={500} src={gradient2} />

        <div className='z-10 flex justify-center pt-8'>
          <button className='rounded-full bg-black px-20 py-1 text-lg text-whiteBackground hover:scale-95 duration-300 ease-in-out'><Link href='#learn-more'>Learn More!</Link></button>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center my-20 relative z-10'>
        <h1 className='text-4xl font-medium'>The creator´s current economic model is broken</h1>
        <div className='flex gap-16 pt-16 pb-8'>
          <div className='bg-purple px-10 pb-6 pt-6 flex justify-center items-center'>
            <p className='w-64'>Creator and their followers doesn't have a meaningful relationship
            No sense of community with value creation and distribution</p>
          </div>
          <div className='bg-purple px-10 pb-6 pt-6 flex justify-center items-center'>
            <p className='w-64'>Capacity for self-finance is challenge for small creators, 
            Finance mechanisms in general with very unfavorable terms</p>
          </div>
          <div className='bg-purple px-10 pb-6 pt-6 flex justify-center items-center'>
            <p className='w-64'>No mechanism to identify and recognize community members impact and participation, nor how to identify their archetypes and implement a healthy community program </p>
          </div>
          
        </div>
      </div>
      <div className='bg-purple w-full py-12 relative px-4 h-full' id="learn-more">
        <div className='w-2/3 px-20 py-8 relative z-10'>
          <h1 className='text-4xl font-medium pb-8'>Tribes addresses creator's pain points</h1>
          <p className='w-[80%] py-2 text-lg'>Tribes aims to address creator's main pain points, by connecting investors, ecosystem users, ecosystem partners & creators in a dynamic relationship with value accrual and sharing</p>
          <p className='w-[80%] py-2 text-lg'>1 - Self-financing: Creator's will be able to launch fund raising for its project as well as issue a pre sale event</p>
          <p className='w-[80%] py-2 text-lg'>2 - Economy enabler: Through a creative engagement mechanism, we truly connect creator´s with its community</p>
          <p className='w-[80%] py-2 text-lg'>3 - Community Oriented: Using blockchain learn how to identify your community archetypes and promote a tailor made experience, elevating the rapport across your community</p>
        </div>
        <Image draggable={false} src={gradient3} width={600} className='absolute right-24 -top-24 z-0'/>
      </div>
    </div>
  )
}
