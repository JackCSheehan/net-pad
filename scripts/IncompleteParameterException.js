class IncompleteParameterException
{
    constructor(paramters)
    {
        this.what = "Incomplete parameter in " + paramters;
    }

    get what()
    {
        return this.what;
    }
}