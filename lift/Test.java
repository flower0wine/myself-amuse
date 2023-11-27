package lift;

/**
 * @author flowerwine
 * @date 2023 年 11 月 24 日
 */
public class Test {

    public static void main(String[] args) throws InterruptedException {
        Client client = Client.singleInstance();
        client.requestDown(7);
        client.requestDown(3);
        client.requestUp(4);
    }
}
