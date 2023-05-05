import { getMonthName } from "@/utils/getMonth"

const StudentCard = ({student, i}) => {
    return (
        <div className='flex p-3 border flex-col md:flex-row border-gray-200 rounded justify-between lg:items-center relative gap-4 hover:border-gray-400'>
            <div className="absolute -top-2 -left-2 p-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold shadow">{i}</div>
            <div className="flex flex-col gap-2">
                <img className='h-16 w-16 object-cover rounded shadow' src={student.student.picture?student.student.picture:'/avatar.png'} alt="" />
                <div className='gap-1 flex flex-col'>
                    <span className='text-lg font-semibold'>{student.student.name}</span>
                    <span className='font-medium text-gray-600'>{student.student.fathername}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className='font-semibold'>{student.student.classes[0].class}</span>
                <span className='font-medium text-gray-600'>{student.student.classes[0].session}</span>
            </div>
            <div className="flex border border-gray-200 rounded p-2 gap-3 flex-wrap">
                {student.newDates.map((date, i) =>(
                    <div key={date} className="flex flex-col items-center p-3 py-2 rounded-full bg-red-100 text-red-600 font-semibold">
                        {getMonthName(date.split('-')[1])}
                        <span className={'text-xs font-thin'}>{date}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentCard