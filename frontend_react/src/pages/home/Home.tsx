import Echarts from "@/components/Echarts";

const option: any = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }
    ]
}

const Home = () => {
    return (
        <div>
            <div className="text-gray-500">Welcome to the Home Page</div>
            <div>
                <Echarts option={option} height="100px" width="100px" />
            </div>
        </div>
    )
}

export default Home;