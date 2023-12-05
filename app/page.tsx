import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import NavItem from "@/components/common/NavItem";
import Navbar from "@/components/common/Navbar";
import { FaTimes } from "react-icons/fa";
import { MdQuestionMark } from "react-icons/md";


export default function Home() {
  return (
    <Container as="main" className="pt-4">
      <Navbar>
        <NavItem>
          <div className="bg-gray-200 h-10 w-10 rounded-full cursor-pointer flex items-center justify-center">
            <MdQuestionMark className="text-2xl text-gray-700" />
          </div>
        </NavItem>

        <NavItem>
          <Button className="flex items-center justify-center">
            <FaTimes className="mr-2" /> Quit game
          </Button>
        </NavItem>
      </Navbar>

    </Container>
  )
}
