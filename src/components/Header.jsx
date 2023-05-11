
function Header(props) {
  return (
    <div className='flex h-20 flex-col justify-center items-center '>
      <div className=" text-3xl">
        {props.children}
      </div>
    </div>
  )
}

export default Header