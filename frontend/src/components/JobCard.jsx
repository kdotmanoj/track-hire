import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"

function JobCard({id,title,company,status,deleteJob,editJob}) {
    return (
        <Card className="w-[250px] shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{company}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground">{status}</div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" className="" onClick={() => {editJob(id)}}>Edit</Button>
                <Button variant="destructive" className="" onClick={() => {deleteJob(id)}}>X</Button>
            </CardFooter>
        </Card>
    )
}

export default JobCard